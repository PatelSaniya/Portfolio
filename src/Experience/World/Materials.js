import * as THREE from 'three'
import Experience from '../Experience.js'
import chromaVertexShader from '../../shaders/chromaShaders/vertex.glsl'
import chromaFragmentShader from '../../shaders/chromaShaders/fragment.glsl'
import TransitionVertexShader from '../../shaders/transitionShaders/vertex.glsl'
import TransitionFragmentShader from '../../shaders/transitionShaders/fragment.glsl'
import SlideTransitionFragmentShader from '../../shaders/transitionShaders/slideFragment.glsl'
import hologramVertexShader from '../../shaders/hologramShaders/vertex.glsl'
import hologramFragmentShader from '../../shaders/hologramShaders/fragment.glsl'
import bigScreenVertexShader from '../../shaders/bigScreenShaders/vertex.glsl'
import bigScreenFragmentShader from '../../shaders/bigScreenShaders/fragment.glsl'
import { portfolioData } from '../../portfolioData.js'

export default class Materials {
  constructor() {
    this.experience = new Experience()
    this.debug = this.experience.debug
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.preLoader = this.experience.preLoader
    this.config = this.experience.config

    this.mapColors()

    // Wait for textures
    this.resources.on('ready', () => {
      this.mapTextures()
    })

    this.preLoader.on('start', () => {
      // Setup
      this.config.touch = this.experience.config.touch
      this.mapEasel()
    })

    // Debug
    this.debugObject = {}
  }

  mapColors() {
    // non-glowing lights
    this.greenSignMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#1EFF51') })
    this.redSignMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF0033') })
    this.whiteSignMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFFFFF') })
    this.blackSignMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#000000') })
    this.pinkSignMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF2FD5') })
    this.blueSignMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#01DDFF') })
    this.orangeSignMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF5100') })
    this.redLedMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF112B') })
    this.greenLedMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#00FF00') })
    this.grayLedOffMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#585858') })
    this.grayLedOnMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFFFFF') })

    // glowing lights
    this.neonYellowMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFF668') })
    this.neonPinkMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF3DCB') })
    this.neonBlueMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#00BBFF') })
    this.poleLightMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FF5EF1') })
    this.neonGreenMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#56FF54') })
  }

  mapTextures() {

    // map baked textures
    this.ramenShopMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.ramenShopBakedTexture })
    this.machinesMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.machinesBakedTexture })
    this.floorMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.floorBakedTexture })
    this.miscMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.miscBakedTexture })
    this.graphicsMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.graphicsBakedTexture })

    // map matcap textures
    this.dishMatcapMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.dishMatcapTexture, side: THREE.DoubleSide })
    this.fanMatcapMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.fanMatcapTexture })
    this.lightMatcapMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.lightMatcapTexture })
    this.neonBlueMatcapMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.neonBlueMatcapTexture })
    this.neonGreenMatcapMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.neonGreenMatcapTexture })

    // map screen textures
    // this.bigScreenMaterial = this.getTransitionShaderMaterial(this.resources.items.bigScreenDefaultTexture)
    // this.vendingMachineScreenMaterial = this.getTransitionShaderMaterial(this.resources.items.vendingMachineDefaultTexture)
    this.sideScreenMaterial = this.getSideScreenShaderMaterial(this.resources.items.sideScreen1Texture)

    // Map video textures

    // https://discourse.threejs.org/t/basis-video-texture/12716/2

    this.littleTVScreenVideoMaterial = this.getChromaKeyShaderMaterial(this.resources.items.littleTVScreenVideoTexture, new THREE.Color("rgb(0, 255, 0)"));
    this.tallScreenVideoMaterial = this.getChromaKeyShaderMaterial(this.resources.items.tallScreenVideoTexture, new THREE.Color("rgb(0, 255, 0)"));
    this.tvScreenVideoMaterial = this.getChromaKeyShaderMaterial(this.resources.items.tvScreenVideoTexture, new THREE.Color("rgb(0, 255, 0)"));

    this.smallScreen1Material = this.getTransitionShaderMaterial(this.resources.items.smallScreenOne1)
    this.smallScreen2Material = this.getTransitionShaderMaterial(this.resources.items.smallScreenTwo1)

    this.smallScreen3VideoMaterial = this.getChromaKeyShaderMaterial(this.resources.items.smallScreen3VideoTexture, new THREE.Color("rgb(0, 255, 0)"));
    this.smallScreen4VideoMaterial = this.getChromaKeyShaderMaterial(this.resources.items.smallScreen4VideoTexture, new THREE.Color("rgb(0, 255, 0)"));
    this.smallScreen5VideoMaterial = this.getChromaKeyShaderMaterial(this.resources.items.smallScreen5VideoTexture, new THREE.Color("rgb(0, 255, 0)"));

    // play the videos (catch AbortError when browser pauses video-only background media)
    for (let i = 0; i < Object.keys(this.resources.video).length; i++) {
      const p = this.resources.video[Object.keys(this.resources.video)[i]].play()
      if (p && typeof p.catch === 'function') p.catch(() => { })
    }

    this.mapPortfolioScreens()
    this.arcadeScreenMaterial = this.getTransitionShaderMaterial(this.resources.items.arcadeScreenDefaultTexture)

    // Shader Materials

    //Hologram
    this.hologramBaseMaterial = new THREE.ShaderMaterial({
      vertexShader: hologramVertexShader,
      fragmentShader: hologramFragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uBigGridThickness: { value: 0.13 },
        uLittleGridThickness: { value: 0.1 },
        uBigGridFrequency: { value: 8.0 },
        uLittleGridFrequency: { value: 24.0 },
        uSpeed: { value: 0.8 },
        uColor: { value: new THREE.Color('#42f2ff') },
      }
    })

    // Big Screen

    this.debugObject.bigScreenLightColor = '#00FFF0'
    this.debugObject.bigScreenDarkColor = '#05a7bd'
    this.debugObject.vendingMachineScreenLightColor = '#34fe81'
    this.debugObject.vendingMachineScreenDarkColor = '#386aff'

    this.bigScreenMaterial = new THREE.ShaderMaterial({
      vertexShader: bigScreenVertexShader,
      fragmentShader: bigScreenFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uXOffset: { value: 0.268 },
        uYOffset: { value: 0.648 },
        uRadialThickness: { value: 4.0 },
        uSpeed: { value: 0.3 },
        uLightColor: { value: new THREE.Color(this.debugObject.bigScreenLightColor) },
        uDarkColor: { value: new THREE.Color(this.debugObject.bigScreenDarkColor) },
        uDefaultTexture: { value: this.resources.items.bigScreenDefaultTexture },
        uTexture1: { value: null },
        uTexture2: { value: null },
        uProgress: { value: 0 },
        uTexture1IsDefault: { value: 1.0 },
        uTexture2IsDefault: { value: 0 },
      }
    })

    this.vendingMachineScreenMaterial = new THREE.ShaderMaterial({
      vertexShader: bigScreenVertexShader,
      fragmentShader: bigScreenFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uXOffset: { value: 0.421 },
        uYOffset: { value: 0.522 },
        uRadialThickness: { value: 4.0 },
        uSpeed: { value: 0.3 },
        uLightColor: { value: new THREE.Color(this.debugObject.vendingMachineScreenLightColor) },
        uDarkColor: { value: new THREE.Color(this.debugObject.vendingMachineScreenDarkColor) },
        uDefaultTexture: { value: this.resources.items.vendingMachineDefaultTexture },
        uTexture1: { value: null },
        uTexture2: { value: null },
        uProgress: { value: 0 },
        uTexture1IsDefault: { value: 1.0 },
        uTexture2IsDefault: { value: 0 },
      }
    })

    // Debug
    if (this.debug.active) {
      //Hologram
      this.debugFolder = this.debug.ui.addFolder('shaderMaterials')
      this.debugFolder.add(this.hologramBaseMaterial.uniforms.uBigGridThickness, 'value').min(0).max(1).step(0.001).name('uBigGridThickness')
      this.debugFolder.add(this.hologramBaseMaterial.uniforms.uLittleGridThickness, 'value').min(0).max(1).step(0.001).name('uLittleGridThickness')
      this.debugFolder.add(this.hologramBaseMaterial.uniforms.uBigGridFrequency, 'value').min(0).max(10).step(1).name('uBigGridFrequency')
      this.debugFolder.add(this.hologramBaseMaterial.uniforms.uLittleGridFrequency, 'value').min(0).max(30).step(1).name('uLittleGridFrequency')
      this.debugFolder.add(this.hologramBaseMaterial.uniforms.uSpeed, 'value').min(0).max(3).step(0.001).name('uSpeed')

      //bigScreen
      this.debugFolder.add(this.bigScreenMaterial.uniforms.uXOffset, 'value').min(-1).max(1).step(0.001).name('bigScreenUXOffset')
      this.debugFolder.add(this.bigScreenMaterial.uniforms.uYOffset, 'value').min(-1).max(1).step(0.001).name('bigScreenUYOffset')
      this.debugFolder.add(this.bigScreenMaterial.uniforms.uRadialThickness, 'value').min(0).max(8.0).step(0.001).name('bigScreenURadialThickness')
      this.debugFolder.add(this.bigScreenMaterial.uniforms.uSpeed, 'value').min(0).max(4).step(0.001).name('bigScreenUSpeed')
      this.debugFolder
        .addColor(this.debugObject, 'bigScreenLightColor')
        .name('bigScreenLightColor')
        .onChange(() => {
          this.bigScreenMaterial.uniforms.uLightColor.value.set(this.debugObject.bigScreenLightColor)
        })
      this.debugFolder
        .addColor(this.debugObject, 'bigScreenDarkColor')
        .name('bigScreenDarkColor')
        .onChange(() => {
          this.bigScreenMaterial.uniforms.uDarkColor.value.set(this.debugObject.bigScreenDarkColor)
        })

      //VendingMchineScreen
      this.debugFolder.add(this.vendingMachineScreenMaterial.uniforms.uXOffset, 'value').min(-1).max(1).step(0.001).name('vendingMachineScreenUXOffset')
      this.debugFolder.add(this.vendingMachineScreenMaterial.uniforms.uYOffset, 'value').min(-1).max(1).step(0.001).name('vendingMachineScreenUYOffset')
      this.debugFolder.add(this.vendingMachineScreenMaterial.uniforms.uRadialThickness, 'value').min(0).max(8.0).step(0.001).name('vendingMachineScreenURadialThickness')
      this.debugFolder.add(this.vendingMachineScreenMaterial.uniforms.uSpeed, 'value').min(0).max(4).step(0.001).name('vendingMachineScreenUSpeed')
      this.debugFolder
        .addColor(this.debugObject, 'vendingMachineScreenLightColor')
        .name('vendingMachineScreenLightColor')
        .onChange(() => {
          this.vendingMachineScreenMaterial.uniforms.uLightColor.value.set(this.debugObject.vendingMachineScreenLightColor)
        })
      this.debugFolder
        .addColor(this.debugObject, 'vendingMachineScreenDarkColor')
        .name('vendingMachineScreenDarkColor')
        .onChange(() => {
          this.vendingMachineScreenMaterial.uniforms.uDarkColor.value.set(this.debugObject.vendingMachineScreenDarkColor)
        })

    }



    this.resources.trigger('texturesMapped')
  }

  mapEasel() {
    if (this.config.touch === true) {
      this.easelMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.easelTouchTexture })
    }
    else {
      this.easelMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.easelClickTexture })
    }

    this.ramenShop = this.experience.world.ramenShop
    this.ramenShop.setEaselMaterial()
  }

  mapPortfolioScreens() {
    const screenTextures = {
      bigScreenDefaultTexture: this.createPortfolioTexture('hero', false, null, 0, true),
      bigScreenAboutMeTexture: this.createPortfolioTexture('about', false, null, 0, true),
      bigScreenSkillsTexture: this.createPortfolioTexture('skills', false, null, 0, true),
      bigScreenExperienceTexture: this.createPortfolioTexture('experience', false, null, 0, true),
      bigScreenAboutMeMobileTexture: this.createPortfolioTexture('about', true, null, 0, true),
      bigScreenSkillsMobileTexture: this.createPortfolioTexture('skills', true, null, 0, true),
      bigScreenExperienceMobileTexture: this.createPortfolioTexture('experience', true, null, 0, true),
      vendingMachineDefaultTexture: this.createPortfolioTexture('projects-default'),
      vendingMachineMenuTexture: this.createPortfolioTexture('projects-menu'),
      arcadeScreenDefaultTexture: this.createPortfolioTexture('arcade-skills-landing'),
      arcadeScreenCreditsTexture: this.createPortfolioTexture('arcade-credits'),
      arcadeScreenThanksTexture: this.createPortfolioTexture('arcade-credits'),
      easelClickTexture: this.createPortfolioTexture('easel-credits-start'),
      easelTouchTexture: this.createPortfolioTexture('easel-credits-start'),
      easelExploreTexture: this.createPortfolioTexture('easel-explore'),
      easelCreditsTexture: this.createPortfolioTexture('easel-credits'),
      easelThanksTexture: this.createPortfolioTexture('easel-thanks')
    }

    portfolioData.projects.forEach((project, index) => {
      screenTextures[`project${index + 1}Texture`] = this.createPortfolioTexture('project', false, project, index)
    })

    portfolioData.technicalSkills.forEach((skill, index) => {
      screenTextures[`skill${index + 1}Texture`] = this.createPortfolioTexture('arcade-skill-detail', false, skill, index)
    })

    Object.assign(this.resources.items, screenTextures)
  }

  createPortfolioTexture(type, mobile = false, project = null, projectIndex = 0, rotateForBigScreen = false) {
    const canvas = document.createElement('canvas')
    canvas.width = mobile ? 1400 : 1600
    canvas.height = mobile ? 1900 : 1600
    const context = canvas.getContext('2d')
    const palette = {
      ink: '#eaffff',
      cyan: '#66f7ff',
      rose: '#ff3bc8',
      yellow: '#ffe66d',
      green: '#69ff8b',
      blue: '#173b8f',
      dark: '#050817',
      panel: 'rgba(10, 23, 45, 0.74)'
    }

    this.paintScreenBase(context, canvas, palette, { frame: type === 'project' ? 'top' : 'center' })

    const margin = mobile ? 120 : 150
    const contentX = rotateForBigScreen && !mobile ? 260 : margin
    const maxWidth = rotateForBigScreen && !mobile ? 1040 : canvas.width - margin * 2
    context.textBaseline = 'top'

    const title = (text, y, size = mobile ? 92 : 86, color = palette.cyan) => {
      context.font = `800 ${size}px Arial, Helvetica, sans-serif`
      context.fillStyle = color
      context.fillText(text, contentX, y)
    }

    const kicker = (text, y) => {
      context.font = `700 ${mobile ? 34 : 32}px Arial, Helvetica, sans-serif`
      context.fillStyle = palette.yellow
      context.fillText(text.toUpperCase(), contentX, y)
    }

    const paragraph = (text, y, size = mobile ? 42 : 38, color = palette.ink, width = maxWidth, lineHeight = size * 1.28) => {
      context.font = `500 ${size}px Arial, Helvetica, sans-serif`
      context.fillStyle = color
      return this.wrapText(context, text, contentX, y, width, lineHeight)
    }

    const chip = (text, x, y, color = palette.green) => {
      context.font = `700 ${mobile ? 28 : 26}px Arial, Helvetica, sans-serif`
      const metrics = context.measureText(text)
      const width = metrics.width + 44
      context.fillStyle = 'rgba(255, 255, 255, 0.08)'
      context.strokeStyle = color
      context.lineWidth = 3
      this.roundRect(context, x, y, width, mobile ? 58 : 52, 14)
      context.fill()
      context.stroke()
      context.fillStyle = color
      context.fillText(text, x + 22, y + 13)
      return width
    }

    const bigScreenButton = (text, x, y, width = 250) => {
      context.fillStyle = 'rgba(255, 255, 255, 0.08)'
      context.strokeStyle = palette.yellow
      context.lineWidth = 4
      this.roundRect(context, x, y, width, 76, 16)
      context.fill()
      context.stroke()
      context.font = '900 30px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.yellow
      context.fillText(text, x + 38, y + 22)
    }

    const bigScreenBackButton = () => {
      bigScreenButton('GO BACK', contentX, margin + 600)
    }

    const bigScreenAboutButtons = () => {
      bigScreenButton('GO BACK', contentX, margin + 600, 250)
    }

    if (type === 'hero') {
      const heroTop = margin + 710
      kicker("Saniya's Resume", heroTop)
      paragraph(portfolioData.role, heroTop + 120, 56, palette.cyan)
      paragraph(portfolioData.summary[0], heroTop + 250, 36)
      paragraph(`${portfolioData.location}  |  ${portfolioData.email}`, heroTop + 500, 32, palette.yellow)
      bigScreenBackButton()
    }

    if (type === 'about') {
      const aboutTop = margin + 730
      kicker('About', aboutTop)
      title('AI builder with full-stack range', aboutTop + 72, 58)
      let y = paragraph(portfolioData.summary[0], aboutTop + 172, 32)
      y = paragraph(portfolioData.summary[1], y + 18, 32)
      kicker('Education', y + 38)
      y += 92
      portfolioData.education.forEach(item => { y = paragraph(item, y + 16, 30, palette.green) })
      bigScreenAboutButtons()
    }

    if (type === 'skills') {
      bigScreenBackButton()
      kicker('Skills', margin + 60)
      title('Machine learning, web systems, delivery', margin + 130, 68)
      let x = margin
      let y = margin + 260
      portfolioData.skills.forEach(skill => {
        const width = chip(skill, x, y)
        x += width + 18
        if (x > canvas.width - margin - 240) {
          x = margin
          y += mobile ? 82 : 76
        }
      })
      kicker('Focus', y + 80)
      y += 140
      portfolioData.focus.forEach(item => { y = paragraph(item, y + 18, 32, palette.ink) })
    }

    if (type === 'experience') {
      bigScreenBackButton()
      kicker('Awards', margin + 60)
      title('Achievements & leadership', margin + 130, 72)
      let y = margin + 250
      portfolioData.achievements.forEach(item => {
        y = paragraph(`- ${item}`, y + 24, 31, palette.ink)
      })
      kicker('Languages', y + 58)
      paragraph('English: professional  |  Hindi: native  |  Swedish: beginner', y + 116, 31, palette.green)
    }

    if (type === 'projects-default' || type === 'projects-menu') {
      const menuWidth = 1150
      const menuHeight = 1450
      const menuLeft = (canvas.width - menuWidth) / 2 - 70   // shift slightly left
      const menuTop = (canvas.height - menuHeight) / 2       // center vertically
      const cardWidth = 205
      const cardHeight = 400
      const cardGapX = 40
      const cardGapY = 75
      const cardStartX = menuLeft + 88
      const cardStartY = menuTop + 135
      const cardColors = ['#ffd64a', '#7de8ff', '#e33edb', '#d9f7ff', '#f8b24c', '#edf2ef', '#ff7c8e', '#c7e942']

      context.fillStyle = '#19cf91'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.fillStyle = 'rgba(8, 43, 54, 0.14)'
      for (let x = 0; x < canvas.width; x += 14) {
        for (let y = 0; y < canvas.height; y += 14) {
          context.fillRect(x, y, 3, 3)
        }
      }

      context.fillStyle = '#28e6ad'
      this.roundRect(context, menuLeft, menuTop, menuWidth, menuHeight, 56)
      context.fill()
      context.strokeStyle = 'rgba(213, 255, 239, 0.85)'
      context.lineWidth = 6
      context.stroke()

      portfolioData.projects.slice(0, 8).forEach((item, index) => {
        const col = index % 4
        const row = Math.floor(index / 4)
        const x = cardStartX + col * (cardWidth + cardGapX)
        const y = cardStartY + row * (cardHeight + cardGapY)
        const color = cardColors[index]

        context.fillStyle = 'rgba(225, 255, 242, 0.84)'
        this.roundRect(context, x, y, cardWidth, cardHeight, 20)
        context.fill()

        context.fillStyle = 'rgba(255, 255, 255, 0.42)'
        this.roundRect(context, x + 20, y + 22, cardWidth - 40, 174, 18)
        context.fill()

        context.fillStyle = color
        this.roundRect(context, x + 67, y + 48, 72, 125, 34)
        context.fill()
        context.fillStyle = 'rgba(12, 37, 50, 0.35)'
        context.fillRect(x + 83, y + 38, 40, 16)
        context.font = '900 31px Arial, Helvetica, sans-serif'
        context.textAlign = 'center'
        context.fillStyle = '#102332'
        context.fillText(String(index + 1).padStart(2, '0'), x + cardWidth / 2, y + 90)

        context.textAlign = 'left'
        context.font = '800 23px Arial, Helvetica, sans-serif'
        context.fillStyle = '#17313c'
        this.wrapText(context, item.title, x + 26, y + 238, cardWidth - 52, 29)
      })

      context.fillStyle = 'rgba(225, 255, 242, 0.88)'
      this.roundRect(context, menuLeft + 120, menuTop + 1120, 520, 220, 18)
      context.fill()
      context.font = '800 39px Arial, Helvetica, sans-serif'
      context.fillStyle = '#253746'
      context.fillText('Go Back', menuLeft + 160, menuTop + 1160)
      context.fillStyle = '#6252f7'
      context.beginPath()
      context.arc(menuLeft + 545, menuTop + 1262, 42, 0, Math.PI * 2)
      context.fill()
      context.strokeStyle = '#ffffff'
      context.lineWidth = 12
      context.lineCap = 'round'
      context.beginPath()
      context.moveTo(menuLeft + 560, menuTop + 1238)
      context.lineTo(menuLeft + 532, menuTop + 1262)
      context.lineTo(menuLeft + 560, menuTop + 1286)
      context.stroke()
      context.lineCap = 'butt'

      const noteX = menuLeft + 700
      const noteY = menuTop + 1120
      context.fillStyle = '#6878ff'
      this.roundRect(context, noteX, noteY, 340, 220, 18)
      context.fill()
      context.fillStyle = '#5a16d9'
      context.beginPath()
      context.moveTo(noteX, noteY + 155)
      context.bezierCurveTo(noteX + 100, noteY + 188, noteX + 235, noteY + 126, noteX + 340, noteY + 143)
      context.lineTo(noteX + 340, noteY + 220)
      context.lineTo(noteX, noteY + 220)
      context.closePath()
      context.fill()
      context.font = '500 35px Arial, Helvetica, sans-serif'
      context.fillStyle = '#ffffff'
      context.fillText('Choose a capsule', noteX + 42, noteY + 42)
      context.fillText('to get started ...', noteX + 42, noteY + 92)
    }

    if (type === 'project' && project) {
      // Project detail uses the TOP-anchored frame (paintScreenBase opts.frame='top').
      // Top frame: y ~ 100..900 (panel inside ~ 160..860).
      const detailTop = 220
      const detailX = 220                                  // panelLeft (200) + small inset
      const detailWidth = canvas.width - detailX - 420     // mirror inset on the right (panelRight=400)

      // PROJECT N kicker
      context.font = `700 ${mobile ? 34 : 32}px Arial, Helvetica, sans-serif`
      context.fillStyle = palette.yellow
      context.fillText(`PROJECT ${projectIndex + 1}`, detailX, detailTop)

      // Title — auto-shrink so it never overflows the frame, and wrap onto a 2nd line if needed
      let titleSize = 80
      context.font = `800 ${titleSize}px Arial, Helvetica, sans-serif`
      while (titleSize > 50 && context.measureText(project.title).width > detailWidth) {
        titleSize -= 4
        context.font = `800 ${titleSize}px Arial, Helvetica, sans-serif`
      }
      context.fillStyle = palette.cyan
      const titleY = this.wrapText(context, project.title, detailX, detailTop + 60, detailWidth, titleSize * 1.1)

      // Meta line (techs)
      context.font = `500 32px Arial, Helvetica, sans-serif`
      context.fillStyle = palette.yellow
      let y = this.wrapText(context, project.meta, detailX, titleY + 30, detailWidth, 42)
      y += 14
      project.bullets.forEach((bullet) => {
        context.font = `500 28px Arial, Helvetica, sans-serif`
        context.fillStyle = palette.ink
        y = this.wrapText(context, `- ${bullet}`, detailX, y + 18, detailWidth, 38)
      })
      // BACK button — render where the projectBack hitbox actually sits (bottom-left of canvas)
      context.font = '800 40px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.yellow
      context.fillText('BACK', margin, canvas.height - margin - 78)
    }

    if (type === 'arcade-default') {
      context.fillStyle = '#18003d'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.strokeStyle = 'rgba(91, 47, 255, 0.55)'
      context.lineWidth = 4
      for (let i = 0; i < canvas.width; i += 85) {
        context.beginPath()
        context.moveTo(i, 0)
        context.lineTo(i, canvas.height)
        context.stroke()
      }
      for (let i = 0; i < canvas.height; i += 85) {
        context.beginPath()
        context.moveTo(0, i)
        context.lineTo(canvas.width, i)
        context.stroke()
      }

      context.textAlign = 'center'
      context.font = '900 52px "Courier New", monospace'
      context.fillStyle = '#ff2a3d'
      context.fillText('SCORE', 185, 95)
      context.fillText('HIGH SCORE', canvas.width / 2, 95)
      context.fillText('LEVEL', canvas.width - 185, 95)

      context.font = '900 50px "Courier New", monospace'
      context.fillStyle = '#ffffff'
      context.fillText('0000', 185, 150)
      context.fillText('0000', canvas.width / 2, 150)
      context.fillText('0000', canvas.width - 185, 150)

      const gradient = context.createLinearGradient(0, 550, 0, 710)
      gradient.addColorStop(0, '#ff4eff')
      gradient.addColorStop(0.45, '#ffffff')
      gradient.addColorStop(0.72, '#ff8d1f')
      gradient.addColorStop(1, '#ffd83f')
      context.font = '900 180px Arial Black, Impact, sans-serif'
      context.lineWidth = 12
      context.strokeStyle = '#ffffff'
      context.strokeText('CREDITS', canvas.width / 2, 610)
      context.fillStyle = gradient
      context.fillText('CREDITS', canvas.width / 2, 610)
      context.lineWidth = 7
      context.strokeStyle = '#8b1eff'
      context.strokeText('CREDITS', canvas.width / 2, 610)

      context.font = '900 60px "Courier New", monospace'
      context.fillStyle = '#ffffff'
      context.fillText('CLICK TO START', canvas.width / 2, 805)

      context.font = '900 50px "Courier New", monospace'
      context.fillText('© 2026 SANIYA', canvas.width / 2, canvas.height - 115)
      context.textAlign = 'left'
    }

    if (type === 'easel-credits-start') {
      const boardX = 155
      const boardY = 110
      const boardWidth = 670
      const boardHeight = 1280
      const boardCenter = boardX + boardWidth / 2

      context.fillStyle = '#18003d'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.strokeStyle = 'rgba(91, 47, 255, 0.62)'
      context.lineWidth = 4
      for (let i = 0; i < canvas.width; i += 75) {
        context.beginPath()
        context.moveTo(i, 0)
        context.lineTo(i, canvas.height)
        context.stroke()
      }
      for (let i = 0; i < canvas.height; i += 75) {
        context.beginPath()
        context.moveTo(0, i)
        context.lineTo(canvas.width, i)
        context.stroke()
      }

      context.strokeStyle = 'rgba(255, 59, 200, 0.62)'
      context.lineWidth = 7
      this.roundRect(context, boardX, boardY, boardWidth, boardHeight, 28)
      context.stroke()

      context.textAlign = 'center'
      context.font = '900 50px "Courier New", monospace'
      context.fillStyle = '#ff2a3d'
      context.fillText('SCORE', boardX + 145, boardY + 75)
      context.fillText('HIGH SCORE', boardX + boardWidth - 180, boardY + 75)

      context.font = '900 44px "Courier New", monospace'
      context.fillStyle = '#ffffff'
      context.fillText('0000', boardX + 145, boardY + 120)
      context.fillText('0000', boardX + boardWidth - 180, boardY + 120)

      const gradient = context.createLinearGradient(0, boardY + 440, 0, boardY + 580)
      gradient.addColorStop(0, '#ff4eff')
      gradient.addColorStop(0.45, '#ffffff')
      gradient.addColorStop(0.72, '#ff8d1f')
      gradient.addColorStop(1, '#ffd83f')
      context.font = '900 124px Arial Black, Impact, sans-serif'
      context.lineWidth = 9
      context.strokeStyle = '#ffffff'
      context.strokeText('CREDITS', boardCenter, boardY + 505)
      context.fillStyle = gradient
      context.fillText('CREDITS', boardCenter, boardY + 505)
      context.lineWidth = 5
      context.strokeStyle = '#8b1eff'
      context.strokeText('CREDITS', boardCenter, boardY + 505)

      context.font = '900 48px "Courier New", monospace'
      context.fillStyle = '#ffffff'
      context.fillText('CLICK TO START', boardCenter, boardY + 625)

      context.font = '900 64px Arial Black, Impact, sans-serif'
      context.fillText('© 2026 SANIYA', boardCenter, boardY + boardHeight - 85)
      context.textAlign = 'left'
    }

    if (type === 'arcade-skills-landing') {
      context.fillStyle = '#071329'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.strokeStyle = 'rgba(102, 247, 255, 0.14)'
      context.lineWidth = 2
      for (let i = 0; i < canvas.width; i += 80) {
        context.beginPath()
        context.moveTo(i, 0)
        context.lineTo(i, canvas.height)
        context.stroke()
      }
      for (let i = 0; i < canvas.height; i += 80) {
        context.beginPath()
        context.moveTo(0, i)
        context.lineTo(canvas.width, i)
        context.stroke()
      }

      const panelX = 125
      const panelY = 100
      const panelWidth = 1350
      const panelHeight = 1190
      const panelCenter = panelX + panelWidth / 2

      context.fillStyle = 'rgba(7, 19, 41, 0.88)'
      this.roundRect(context, panelX, panelY, panelWidth, panelHeight, 34)
      context.fill()

      context.strokeStyle = 'rgba(255, 59, 200, 0.72)'
      context.lineWidth = 8
      this.roundRect(context, panelX, panelY, panelWidth, panelHeight, 34)
      context.stroke()

      const backX = panelX + panelWidth - 310
      const backY = panelY + 60
      const backWidth = 240
      const backHeight = 82

      context.fillStyle = 'rgba(255, 255, 255, 0.08)'
      context.strokeStyle = palette.yellow
      context.lineWidth = 4
      this.roundRect(context, backX, backY, backWidth, backHeight, 16)
      context.fill()
      context.stroke()
      context.textAlign = 'left'
      context.font = '900 30px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.yellow
      context.fillText('GO BACK', backX + 46, backY + 24)

      context.textAlign = 'center'
      context.font = '900 150px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.cyan
      context.fillText('Skills', panelCenter, panelY + 360)

      context.font = '800 46px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.ink
      context.fillText("Explore Saniya's technical skill stack.", panelCenter, panelY + 535)

      context.fillStyle = 'rgba(255, 255, 255, 0.08)'
      context.strokeStyle = palette.green
      context.lineWidth = 5
      this.roundRect(context, panelCenter - 285, panelY + 705, 570, 130, 24)
      context.fill()
      context.stroke()

      context.font = '900 42px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.yellow
      context.fillText('CLICK TO START', panelCenter, panelY + 738)
    }

    if (type === 'arcade-credits') {
      context.fillStyle = '#071329'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.strokeStyle = 'rgba(102, 247, 255, 0.14)'
      context.lineWidth = 2
      for (let i = 0; i < canvas.width; i += 80) {
        context.beginPath()
        context.moveTo(i, 0)
        context.lineTo(i, canvas.height)
        context.stroke()
      }
      for (let i = 0; i < canvas.height; i += 80) {
        context.beginPath()
        context.moveTo(0, i)
        context.lineTo(canvas.width, i)
        context.stroke()
      }

      const panelX = 125
      const panelY = 100
      const panelWidth = 1350
      const panelHeight = 1190

      context.fillStyle = 'rgba(7, 19, 41, 0.88)'
      this.roundRect(context, panelX, panelY, panelWidth, panelHeight, 34)
      context.fill()

      context.strokeStyle = 'rgba(255, 59, 200, 0.72)'
      context.lineWidth = 8
      this.roundRect(context, panelX, panelY, panelWidth, panelHeight, 34)
      context.stroke()

      context.textAlign = 'left'
      context.font = '900 78px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.yellow
      context.fillText('Technical Skills', panelX + 62, panelY + 56)

      context.font = '800 34px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.cyan
      context.fillText('Choose a capsule to view Saniya\'s skill stack.', panelX + 66, panelY + 148)

      const backX = panelX + panelWidth - 310
      const backY = panelY + 60
      const backWidth = 240
      const backHeight = 82

      context.fillStyle = 'rgba(255, 255, 255, 0.08)'
      context.strokeStyle = palette.yellow
      context.lineWidth = 4
      this.roundRect(context, backX, backY, backWidth, backHeight, 16)
      context.fill()
      context.stroke()
      context.font = '900 30px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.yellow
      context.fillText('GO BACK', backX + 46, backY + 24)

      const cardWidth = 560
      const cardHeight = 185
      const gapX = 70
      const gapY = 34
      const startX = panelX + 64
      const startY = panelY + 290

      portfolioData.technicalSkills.forEach((skill, index) => {
        const col = index % 2
        const row = Math.floor(index / 2)
        const x = startX + col * (cardWidth + gapX)
        const y = startY + row * (cardHeight + gapY)
        const color = index % 2 ? palette.rose : palette.cyan

        context.fillStyle = 'rgba(255, 255, 255, 0.08)'
        context.strokeStyle = color
        context.lineWidth = 5
        this.roundRect(context, x, y, cardWidth, cardHeight, 22)
        context.fill()
        context.stroke()

        context.font = '900 33px Arial, Helvetica, sans-serif'
        context.fillStyle = color
        context.fillText(String(index + 1).padStart(2, '0'), x + 30, y + 28)

        context.font = '900 32px Arial, Helvetica, sans-serif'
        context.fillStyle = palette.ink
        this.wrapText(context, skill.title, x + 95, y + 28, cardWidth - 125, 35)

        context.font = '800 24px Arial, Helvetica, sans-serif'
        context.fillStyle = palette.yellow
        context.fillText('CLICK TO OPEN', x + 95, y + 106)
      })
    }

    if (type === 'arcade-skill-detail' && project) {
      context.fillStyle = '#071329'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.strokeStyle = 'rgba(102, 247, 255, 0.14)'
      context.lineWidth = 2
      for (let i = 0; i < canvas.width; i += 80) {
        context.beginPath()
        context.moveTo(i, 0)
        context.lineTo(i, canvas.height)
        context.stroke()
      }
      for (let i = 0; i < canvas.height; i += 80) {
        context.beginPath()
        context.moveTo(0, i)
        context.lineTo(canvas.width, i)
        context.stroke()
      }

      const panelX = 155
      const panelY = 105
      const panelWidth = 1290
      const panelHeight = 1195

      context.fillStyle = 'rgba(7, 19, 41, 0.9)'
      this.roundRect(context, panelX, panelY, panelWidth, panelHeight, 34)
      context.fill()

      context.strokeStyle = projectIndex % 2 ? 'rgba(255, 59, 200, 0.78)' : 'rgba(102, 247, 255, 0.78)'
      context.lineWidth = 8
      this.roundRect(context, panelX, panelY, panelWidth, panelHeight, 34)
      context.stroke()

      context.textAlign = 'left'
      context.font = '900 44px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.yellow
      context.fillText(`SKILLS ${String(projectIndex + 1).padStart(2, '0')}`, panelX + 70, panelY + 72)

      context.fillStyle = 'rgba(255, 255, 255, 0.08)'
      context.strokeStyle = palette.yellow
      context.lineWidth = 4
      this.roundRect(context, panelX + panelWidth - 310, panelY + 60, 240, 82, 16)
      context.fill()
      context.stroke()
      context.font = '900 30px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.yellow
      context.fillText('GO BACK', panelX + panelWidth - 264, panelY + 84)

      context.font = '900 92px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.cyan
      this.wrapText(context, project.title, panelX + 70, panelY + 150, panelWidth - 140, 102)

      context.font = '800 44px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.ink
      let lineY = panelY + 360
      project.items.forEach(item => {
        lineY = this.wrapText(context, `- ${item}`, panelX + 90, lineY, panelWidth - 180, 62)
      })

      context.font = '800 32px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.yellow
      context.fillText('Use GO BACK to return to capsules.', panelX + 70, panelY + panelHeight - 105)
    }

    if (type === 'arcade-thanks') {
      title('Thank you', margin, mobile ? 112 : 112, palette.rose)
      paragraph('Open to AI, ML, computer vision, and full-stack software opportunities.', margin + 165, mobile ? 42 : 40)
    }

    if (type === 'easel-explore') {
      const boardX = 160
      const boardY = 130
      const boardWidth = 660
      const boardHeight = 1240
      const boardCenter = boardX + boardWidth / 2

      context.fillStyle = '#071329'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.strokeStyle = 'rgba(102, 247, 255, 0.12)'
      context.lineWidth = 2
      for (let i = 0; i < canvas.width; i += 80) {
        context.beginPath()
        context.moveTo(i, 0)
        context.lineTo(i, canvas.height)
        context.stroke()
      }
      for (let i = 0; i < canvas.height; i += 80) {
        context.beginPath()
        context.moveTo(0, i)
        context.lineTo(canvas.width, i)
        context.stroke()
      }

      context.strokeStyle = 'rgba(255, 59, 200, 0.78)'
      context.lineWidth = 9
      this.roundRect(context, boardX, boardY, boardWidth, boardHeight, 30)
      context.stroke()

      context.textAlign = 'center'
      context.font = '900 54px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.yellow
      context.fillText('CLICK', boardCenter, boardY + 86)

      context.font = '900 90px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.cyan
      context.fillText('Explore', boardCenter, boardY + 190)
      context.fillText('Saniya', boardCenter, boardY + 282)

      context.font = '900 44px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.ink
      context.fillText('Projects: vending machine', boardCenter, boardY + 485)
      context.fillText('About: big screen', boardCenter, boardY + 570)
      context.fillText('Skills: gaming machine', boardCenter, boardY + 655)

      context.textAlign = 'left'
    }

    if (type === 'easel-credits' || type === 'easel-thanks') {
      const boardX = 160
      const boardY = 130
      const boardWidth = 660
      const boardHeight = 1240
      const boardCenter = boardX + boardWidth / 2

      context.fillStyle = '#071329'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.strokeStyle = 'rgba(102, 247, 255, 0.12)'
      context.lineWidth = 2
      for (let i = 0; i < canvas.width; i += 80) {
        context.beginPath()
        context.moveTo(i, 0)
        context.lineTo(i, canvas.height)
        context.stroke()
      }
      for (let i = 0; i < canvas.height; i += 80) {
        context.beginPath()
        context.moveTo(0, i)
        context.lineTo(canvas.width, i)
        context.stroke()
      }

      context.strokeStyle = 'rgba(255, 59, 200, 0.78)'
      context.lineWidth = 9
      this.roundRect(context, boardX, boardY, boardWidth, boardHeight, 30)
      context.stroke()

      context.textAlign = 'center'
      if (type === 'easel-credits') {
        context.font = '900 116px Arial, Helvetica, sans-serif'
        context.fillStyle = palette.yellow
        context.fillText('Credits', boardCenter, boardY + 190)

        context.font = '800 52px Arial, Helvetica, sans-serif'
        context.fillStyle = palette.ink
        context.fillText('Portfolio for Saniya', boardCenter, boardY + 390)
        context.font = '800 46px Arial, Helvetica, sans-serif'
        context.fillStyle = palette.cyan
        context.fillText('Built from the interactive', boardCenter, boardY + 500)
        context.fillText('ramen-shop inspiration', boardCenter, boardY + 565)
        context.fillText('scene.', boardCenter, boardY + 630)
      }
      else {
        context.font = '900 102px Arial, Helvetica, sans-serif'
        context.fillStyle = palette.rose
        context.fillText('Thank you', boardCenter, boardY + 210)

        context.font = '800 48px Arial, Helvetica, sans-serif'
        context.fillStyle = palette.ink
        context.fillText('Open to AI, ML,', boardCenter, boardY + 410)
        context.fillText('computer vision,', boardCenter, boardY + 482)
        context.fillText('and full-stack roles.', boardCenter, boardY + 554)
      }

      context.font = '900 48px Arial, Helvetica, sans-serif'
      context.fillStyle = palette.yellow
      context.fillText('CLICK TO CONTINUE', boardCenter, boardY + 1030)
      context.textAlign = 'left'
    }

    const outputCanvas = type.startsWith('arcade') ? this.rotateCanvasCounterClockwise(canvas) : (rotateForBigScreen ? this.rotateCanvasClockwise(canvas) : canvas)
    const texture = new THREE.CanvasTexture(outputCanvas)
    texture.flipY = false
    texture.encoding = THREE.sRGBEncoding
    texture.needsUpdate = true
    return texture
  }

  rotateCanvasCounterClockwise(source) {
    const rotated = document.createElement('canvas')
    rotated.width = source.height
    rotated.height = source.width
    const context = rotated.getContext('2d')
    context.fillStyle = '#050817'
    context.fillRect(0, 0, rotated.width, rotated.height)
    context.translate(rotated.width / 2, rotated.height / 2)
    context.rotate(-Math.PI / 2)
    context.drawImage(source, -source.width / 2, -source.height / 2)
    return rotated
  }

  rotateCanvasClockwise(source) {
    const rotated = document.createElement('canvas')
    rotated.width = source.height
    rotated.height = source.width
    const context = rotated.getContext('2d')
    context.fillStyle = '#050817'
    context.fillRect(0, 0, rotated.width, rotated.height)
    context.translate(rotated.width / 2, rotated.height / 2)
    context.rotate(Math.PI / 2)
    const scale = 1
    context.drawImage(source, -source.width * scale / 2, -source.height * scale / 2, source.width * scale, source.height * scale)
    return rotated
  }

  paintScreenBase(context, canvas, palette, opts = {}) {
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, palette.dark)
    gradient.addColorStop(0.52, '#071f3a')
    gradient.addColorStop(1, '#220628')
    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.strokeStyle = 'rgba(102, 247, 255, 0.14)'
    context.lineWidth = 2
    for (let i = 0; i < canvas.width; i += 80) {
      context.beginPath()
      context.moveTo(i, 0)
      context.lineTo(i, canvas.height)
      context.stroke()
    }
    for (let i = 0; i < canvas.height; i += 80) {
      context.beginPath()
      context.moveTo(0, i)
      context.lineTo(canvas.width, i)
      context.stroke()
    }

    // Default = centered frame for the big screen.
    // Pass opts.frame = 'top' to anchor the frame near the top (used by vending-machine project detail).
    let frameLeft, frameRight, frameTop, frameBottom
    let panelLeft, panelRight, panelTop, panelBottom
    if (opts.frame === 'top') {
      // Vending machine portrait screen — bias LEFT so the frame appears centered on the visible mesh
      frameLeft = 150
      frameRight = 350
      frameTop = 100
      frameBottom = 700
      panelLeft = 200
      panelRight = 400
      panelTop = 160
      panelBottom = 740
    }
    else {
      frameLeft = 150
      frameRight = 150
      frameTop = 700
      frameBottom = 130
      panelLeft = 200
      panelRight = 200
      panelTop = 760
      panelBottom = 190
    }

    context.strokeStyle = 'rgba(255, 59, 200, 0.55)'
    context.lineWidth = 9
    this.roundRect(context, frameLeft, frameTop, canvas.width - frameLeft - frameRight, canvas.height - frameTop - frameBottom, 34)
    context.stroke()
    context.fillStyle = palette.panel
    this.roundRect(context, panelLeft, panelTop, canvas.width - panelLeft - panelRight, canvas.height - panelTop - panelBottom, 28)
    context.fill()
  }

  wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ')
    let line = ''
    for (let i = 0; i < words.length; i++) {
      const testLine = `${line}${words[i]} `
      if (context.measureText(testLine).width > maxWidth && i > 0) {
        context.fillText(line, x, y)
        line = `${words[i]} `
        y += lineHeight
      }
      else {
        line = testLine
      }
    }
    context.fillText(line, x, y)
    return y + lineHeight
  }

  roundRect(context, x, y, width, height, radius) {
    context.beginPath()
    context.moveTo(x + radius, y)
    context.arcTo(x + width, y, x + width, y + height, radius)
    context.arcTo(x + width, y + height, x, y + height, radius)
    context.arcTo(x, y + height, x, y, radius)
    context.arcTo(x, y, x + width, y, radius)
    context.closePath()
  }

  // https://discourse.threejs.org/t/basis-video-texture/12716

  getChromaKeyShaderMaterial(texture, color) {

    return new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      transparent: true,
      uniforms: {
        map: {
          value: texture
        },
        keyColor: {
          value: color.toArray()
        },
        similarity: {
          value: 0.01
        },
        smoothness: {
          value: 0.0
        }
      },
      vertexShader: chromaVertexShader,
      fragmentShader: chromaFragmentShader
    });
  }

  getTransitionShaderMaterial(texture) {

    return new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      uniforms: {
        texture1: { value: texture },
        progress: { value: 0 },
        texture2: { value: null },
      },
      // wireframe: true,
      vertexShader: TransitionVertexShader,
      fragmentShader: TransitionFragmentShader
    });
  }

  getSideScreenShaderMaterial(texture) {

    return new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      uniforms: {
        texture1: { value: texture },
        progress: { value: 0 },
        texture2: { value: null },
      },
      // wireframe: true,
      vertexShader: TransitionVertexShader,
      fragmentShader: SlideTransitionFragmentShader
    });
  }


}
