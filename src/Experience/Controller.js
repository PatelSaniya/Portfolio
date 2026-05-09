import Experience from './Experience.js'
import gsap from 'gsap'
import { portfolioData } from '../portfolioData.js'

export default class Controller
{
    constructor()
    {

        // Setup
        this.experience = new Experience()
        this.camera = this.experience.camera
        this.resources = this.experience.resources
        this.sounds = this.experience.sounds
        this.preLoader = this.experience.preLoader
        this.config = this.experience.config
        this.animations = this.experience.animations

        this.setLogic()
        this.setProjectControls()
        this.setMenuControls()
        this.setAboutMeControls()
        this.setArcadeScreenControls()
        this.setCamControls()
        this.setVideoControls()
        this.setSocialControls()

        this.resources.on('ready', () =>
        {
            this.ramenShop = this.experience.world.ramenShop
            this.materials = this.experience.materials
        })

    }

    
    setLogic()
    {
        this.logic = {}
        this.logic.buttonsLocked = false
        this.logic.mode = 'menu'
        this.logic.easelStep = 0
        this.logic.selectedSkill = null

        this.logic.lockButtons = async (lockDuration) =>
        {
            this.logic.buttonsLocked = true
            await this.sleep(lockDuration)
            this.logic.buttonsLocked = false
        }
    }

    // Project selection

    setProjectControls()
    {
        this.projectControls = {}
        this.projectControls.project1 = async () =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'projects0')
            {
                this.sounds.playBloop()
                this.logic.mode = 'projects1'
                this.bigScreenTransition(
                    this.materials.vendingMachineScreenMaterial,
                    this.resources.items.project1Texture,
                    0.2
                )
            }
        }
        this.projectControls.project2 = async () =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'projects0')
            {
                this.sounds.playBloop()
                this.logic.mode = 'projects2'
                this.bigScreenTransition(
                    this.materials.vendingMachineScreenMaterial,
                    this.resources.items.project2Texture,
                    0.2
                )
            }
        }
        this.projectControls.project3 = async () =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'projects0')
            {
                this.sounds.playBloop()
                this.logic.mode = 'projects3'
                this.bigScreenTransition(
                    this.materials.vendingMachineScreenMaterial,
                    this.resources.items.project3Texture,
                    0.2
                )
            }
        }
        this.projectControls.project4 = async () =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'projects0')
            {
                this.sounds.playBloop()
                this.logic.mode = 'projects4'
                this.bigScreenTransition(
                    this.materials.vendingMachineScreenMaterial,
                    this.resources.items.project4Texture,
                    0.2
                )
            }
        }
        this.projectControls.project5 = async () =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'projects0')
            {
                this.sounds.playBloop()
                this.logic.mode = 'projects5'
                this.bigScreenTransition(
                    this.materials.vendingMachineScreenMaterial,
                    this.resources.items.project5Texture,
                    0.2
                )
            }
        }
        this.projectControls.project6 = async () =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'projects0')
            {
                this.sounds.playBloop()
                this.logic.mode = 'projects6'
                this.bigScreenTransition(
                    this.materials.vendingMachineScreenMaterial,
                    this.resources.items.project6Texture,
                    0.2
                )
            }
        }
        this.projectControls.project7 = async () =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'projects0')
            {
                this.sounds.playBloop()
                this.logic.mode = 'projects7'
                this.bigScreenTransition(
                    this.materials.vendingMachineScreenMaterial,
                    this.resources.items.project7Texture,
                    0.2
                )
            }
        }
        this.projectControls.project8 = async () =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'projects0')
            {
                this.sounds.playBloop()
                this.logic.mode = 'projects8'
                this.bigScreenTransition(
                    this.materials.vendingMachineScreenMaterial,
                    this.resources.items.project8Texture,
                    0.2
                )
            }
        }

        // Go back
        this.projectControls.projectBack = async () =>
        {
            if(this.logic.buttonsLocked === false && (this.logic.mode === 'projects0'))
            {
                this.sounds.playBloop()
                this.logic.lockButtons(1500)
                this.logic.mode = 'menu'
                this.camControls.toDefault()
                this.bigScreenTransition(
                    this.materials.vendingMachineScreenMaterial,
                    this.resources.items.vendingMachineDefaultTexture,
                    0.4,
                    true
                )
            }

            if(this.logic.buttonsLocked === false && (this.logic.mode === 'projects1' || this.logic.mode === 'projects2' || this.logic.mode === 'projects3'|| this.logic.mode === 'projects4'|| this.logic.mode === 'projects5'|| this.logic.mode === 'projects6'|| this.logic.mode === 'projects7'|| this.logic.mode === 'projects8'))
            {
                this.sounds.playBloop()
                this.logic.mode = 'projects0'
                this.bigScreenTransition(
                    this.materials.vendingMachineScreenMaterial,
                    this.resources.items.vendingMachineMenuTexture,
                    0.2
                )
            }
            console.log('projectBack')
        }

        // Enter
        this.projectControls.projectEnter = async () =>
        {
            console.log('projectEnter')
        }
    }

    // Main menu controls

    setMenuControls()
    {
        this.menuControls = {}
        this.menuControls.projects = async (obj, color) =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'menu')
            {
                this.sounds.playClick()
                this.logic.mode = 'projects0'
                this.menuControls.buttonIndicator(obj, color)
                this.camControls.toProjects()

                this.bigScreenTransition(
                    this.materials.vendingMachineScreenMaterial,
                    this.resources.items.vendingMachineMenuTexture,
                    0.2
                )
            }
 
        }
        this.menuControls.easelBoard = async (obj, color) =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'menu')
            {
                this.sounds.playClick()
                this.logic.mode = 'easel'
                this.logic.easelStep = 0
                this.menuControls.buttonIndicator(obj, color)
                this.ramenShop.setEaselTexture(this.resources.items.easelClickTexture)
                this.camControls.toEasel()
            }
            else if(this.logic.buttonsLocked === false && this.logic.mode === 'easel')
            {
                this.sounds.playClick()
                if(this.logic.easelStep === 0)
                {
                    this.logic.easelStep = 1
                    this.ramenShop.setEaselTexture(this.resources.items.easelExploreTexture)
                }
                else if(this.logic.easelStep === 1)
                {
                    this.logic.easelStep = 2
                    this.ramenShop.setEaselTexture(this.resources.items.easelCreditsTexture)
                }
                else if(this.logic.easelStep === 2)
                {
                    this.logic.easelStep = 3
                    this.ramenShop.setEaselTexture(this.resources.items.easelThanksTexture)
                }
                else
                {
                    this.logic.easelStep = 0
                    this.logic.mode = 'menu'
                    this.ramenShop.setEaselTexture(this.resources.items.easelClickTexture)
                    this.camControls.toDefault()
                }
            }
        }
        this.menuControls.articles = async (obj, color) =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'menu')
            {
                this.sounds.playClick()
                this.menuControls.buttonIndicator(obj, color)
                await this.sleep(250)
                window.open(portfolioData.links.resume, '_blank')
            }
        }
        this.menuControls.aboutMe = async (obj, color) =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'menu')
            {
                this.sounds.playClick()
                this.logic.mode = 'aboutLanding'
                this.menuControls.buttonIndicator(obj, color)
                this.camControls.toAboutMe()

                this.bigScreenTransition(
                    this.materials.bigScreenMaterial,
                    this.resources.items.bigScreenDefaultTexture,
                    0.2,
                )

            }
        }
        this.menuControls.credits = async (obj, color) =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'menu')
            {
                this.sounds.playClick()
                this.logic.mode = 'skillsLanding'
                this.menuControls.buttonIndicator(obj, color)
                // Flash the green-panel "credits" text white briefly for click feedback
                this.menuControls.flashColor(this.ramenShop.greenSquareCredits, 0xffffff, 0x000000, 200)
                this.camControls.toCredits()
                this.screenTransition(
                    this.materials.arcadeScreenMaterial,
                    this.resources.items.arcadeScreenDefaultTexture,
                    0.2
                )
            }
        }

        // Quickly toggle a mesh's material color to give click feedback
        this.menuControls.flashColor = async (obj, flashHex, restoreHex, ms) =>
        {
            if(!obj || !obj.material || !obj.material.color) return
            obj.material.color.setHex(flashHex)
            await this.sleep(ms)
            obj.material.color.setHex(restoreHex)
        }

        this.menuControls.buttonIndicator = async (obj, color) =>
        {
            // Guard against missing meshes (e.g. credits sign was removed/replaced)
            if(!obj) return
            if (color === 'black') {
                obj.material = this.ramenShop.materials.whiteSignMaterial
                await this.sleep(200)
                obj.material = this.ramenShop.materials.blackSignMaterial
            }
            if (color === 'white') {
                obj.material = this.ramenShop.materials.blackSignMaterial
                await this.sleep(200)
                obj.material = this.ramenShop.materials.whiteSignMaterial
            }
        }
    }

    // About me big screen controls

    setAboutMeControls()
    {
        this.aboutMeControls = {}

        this.aboutMeControls.aboutMeScreens = async () =>
        {
            if(this.logic.buttonsLocked === false && (this.logic.mode === 'aboutLanding' || this.logic.mode === 'skills' || this.logic.mode === 'experience'))
            {
                this.sounds.playBloop()
                this.logic.mode = 'aboutMe'
                
                if(this.config.vertical === true)
                {
                    this.bigScreenTransition(
                        this.materials.bigScreenMaterial,
                        this.resources.items.bigScreenAboutMeMobileTexture,
                        0.2
                    )
                }
                else
                {
                    this.bigScreenTransition(
                        this.materials.bigScreenMaterial,
                        this.resources.items.bigScreenAboutMeTexture,
                        0.2
                    )
                }
            }
        }

        this.aboutMeControls.aboutMeSkills = async () =>
        {
            if(this.logic.buttonsLocked === false && (this.logic.mode === 'aboutMe' || this.logic.mode === 'experience'))
            {
                this.sounds.playBloop()
                this.logic.mode = 'skills'

                if(this.config.vertical === true)
                {
                    this.bigScreenTransition(
                        this.materials.bigScreenMaterial,
                        this.resources.items.bigScreenSkillsMobileTexture,
                        0.2
                    )
                }
                else
                {
                    this.bigScreenTransition(
                        this.materials.bigScreenMaterial,
                        this.resources.items.bigScreenSkillsTexture,
                        0.2
                    )
                }
            }
        }

        this.aboutMeControls.aboutMeExperience = async () =>
        {
            if(this.logic.buttonsLocked === false && (this.logic.mode === 'aboutMe' || this.logic.mode === 'skills'))
            {
                this.sounds.playBloop()
                this.logic.mode = 'experience'

                if(this.config.vertical === true)
                {
                    this.bigScreenTransition(
                        this.materials.bigScreenMaterial,
                        this.resources.items.bigScreenExperienceMobileTexture,
                        0.2
                    )
                }
                else
                {
                    this.bigScreenTransition(
                        this.materials.bigScreenMaterial,
                        this.resources.items.bigScreenExperienceTexture,
                        0.2
                    )
                }
            }
        }

        this.aboutMeControls.aboutMeBack = async () =>
        {
            if(this.logic.buttonsLocked === false && (this.logic.mode === 'aboutLanding' || this.logic.mode === 'aboutMe' || this.logic.mode === 'skills' || this.logic.mode === 'experience'))
            {
                this.sounds.playBloop()
                this.logic.mode = 'menu'
                this.camControls.toDefault()

                this.bigScreenTransition(
                    this.materials.bigScreenMaterial,
                    this.resources.items.bigScreenDefaultTexture,
                    0.4,
                    1,
                    0
                )
            }
        }

        this.aboutMeControls.aboutMeLanding = async () =>
        {
            if(this.logic.buttonsLocked === false && (this.logic.mode === 'aboutMe' || this.logic.mode === 'skills' || this.logic.mode === 'experience'))
            {
                this.sounds.playBloop()
                this.logic.mode = 'aboutLanding'

                this.bigScreenTransition(
                    this.materials.bigScreenMaterial,
                    this.resources.items.bigScreenDefaultTexture,
                    0.2
                )
            }
        }
    }

    //arcade screen credit controls

    setArcadeScreenControls()
    {
        this.screenControls = {}
        this.screenControls.arcadeScreen = async (uv) =>
        {
            if(this.logic.buttonsLocked === false && this.logic.mode === 'skillsLanding' )
            {
                if(this.isArcadeBackButtonFromUv(uv))
                {
                    this.sounds.playArcade()
                    this.logic.mode = 'menu'
                    this.camControls.toDefault()
                    return
                }

                this.sounds.playArcade()
                this.logic.mode = 'credits'
                this.screenTransition(
                    this.materials.arcadeScreenMaterial,
                    this.resources.items.arcadeScreenCreditsTexture,
                    0.2
                )
            }
            else if(this.logic.buttonsLocked === false && this.logic.mode === 'credits' )
            {
                if(this.isArcadeBackButtonFromUv(uv))
                {
                    this.sounds.playArcade()
                    this.logic.mode = 'skillsLanding'
                    this.screenTransition(
                        this.materials.arcadeScreenMaterial,
                        this.resources.items.arcadeScreenDefaultTexture,
                        0.2
                    )
                    return
                }

                const skillIndex = this.getArcadeSkillIndexFromUv(uv)
                if(skillIndex === null)
                {
                    return
                }

                this.sounds.playArcade()
                this.logic.mode = 'skillDetail'
                this.logic.selectedSkill = skillIndex
                this.screenTransition(
                    this.materials.arcadeScreenMaterial,
                    this.resources.items[`skill${skillIndex + 1}Texture`],
                    0.2
                )
            }
            else if(this.logic.buttonsLocked === false && this.logic.mode === 'skillDetail' )
            {
                if(!this.isArcadeBackButtonFromUv(uv))
                {
                    return
                }

                this.sounds.playArcade()
                this.logic.mode = 'credits'
                this.screenTransition(
                    this.materials.arcadeScreenMaterial,
                    this.resources.items.arcadeScreenCreditsTexture,
                    0.2
                )
            }
        }

        this.screenControls.bigScreen = async (uv) =>
        {
            if(this.logic.buttonsLocked === true)
            {
                return
            }

            if(this.logic.mode === 'menu')
            {
                this.menuControls.aboutMe(this.ramenShop.aboutMeBlack, 'black')
                return
            }

            if(this.logic.mode === 'aboutLanding')
            {
                if(this.isBigScreenButtonFromUv(uv, 'back'))
                {
                    this.aboutMeControls.aboutMeBack()
                    return
                }

                this.aboutMeControls.aboutMeScreens()
                return
            }

            if(this.logic.mode === 'aboutMe' || this.logic.mode === 'skills' || this.logic.mode === 'experience')
            {
                if(this.isBigScreenButtonFromUv(uv, 'back'))
                {
                    this.aboutMeControls.aboutMeLanding()
                }
            }
        }

    }

    getBigScreenButtonRect()
    {
        const x = 260
        const y = 750

        return { x, y, width: 250, height: 76 }
    }

    isBigScreenButtonFromUv(uv, type)
    {
        if(!uv)
        {
            return false
        }

        const canvasSize = 1600
        const rect = this.getBigScreenButtonRect(type)
        const points = this.getBigScreenSourcePointCandidates(uv, canvasSize)

        return points.some(({ sourceX, sourceY }) =>
            sourceX >= rect.x &&
            sourceX <= rect.x + rect.width &&
            sourceY >= rect.y &&
            sourceY <= rect.y + rect.height
        )
    }

    getBigScreenSourcePointCandidates(uv, canvasSize)
    {
        return [
            { sourceX: (1 - uv.y) * canvasSize, sourceY: uv.x * canvasSize },
            { sourceX: (1 - uv.y) * canvasSize, sourceY: (1 - uv.x) * canvasSize },
            { sourceX: uv.y * canvasSize, sourceY: uv.x * canvasSize },
            { sourceX: uv.y * canvasSize, sourceY: (1 - uv.x) * canvasSize }
        ]
    }

    getArcadeSkillIndexFromUv(uv)
    {
        if(!uv)
        {
            return null
        }

        const canvasSize = 1600
        const { sourceX, sourceY } = this.getArcadeSourcePoint(uv, canvasSize)
        const panelX = 125
        const panelY = 100
        const cardWidth = 560
        const cardHeight = 185
        const gapX = 70
        const gapY = 34
        const startX = panelX + 64
        const startY = panelY + 290

        for(let index = 0; index < portfolioData.technicalSkills.length; index++)
        {
            const col = index % 2
            const row = Math.floor(index / 2)
            const x = startX + col * (cardWidth + gapX)
            const y = startY + row * (cardHeight + gapY)

            if(sourceX >= x && sourceX <= x + cardWidth && sourceY >= y && sourceY <= y + cardHeight)
            {
                return index
            }
        }

        return null
    }

    isArcadeBackButtonFromUv(uv)
    {
        if(!uv)
        {
            return false
        }

        const canvasSize = 1600
        const { sourceX, sourceY } = this.getArcadeSourcePoint(uv, canvasSize)
        const panelX = 125
        const panelY = 100
        const panelWidth = 1350
        const backX = panelX + panelWidth - 310
        const backY = panelY + 60
        const backWidth = 240
        const backHeight = 82

        return sourceX >= backX && sourceX <= backX + backWidth && sourceY >= backY && sourceY <= backY + backHeight
    }

    getArcadeSourcePoint(uv, canvasSize)
    {
        return {
            sourceX: (1 - uv.y) * canvasSize,
            sourceY: uv.x * canvasSize
        }
    }

    // camera transitions and angles

    setCamControls()
    {
        this.camControls = {}
        this.camControls.toProjects = async () =>
        {
            this.sounds.playWhoosh()

            this.logic.lockButtons(1500)
            this.camera.camAngle.unlocked()
            this.camera.transitions.vendingMachine(1.5)
            await this.sleep(1500)
            this.camera.camAngle.vendingMachine()
        }
        this.camControls.toDefault = async () =>
        {
            this.sounds.playWhoosh()

            this.logic.lockButtons(1500)
            this.camera.camAngle.unlocked()
            this.camera.transitions.default(1.5)
            await this.sleep(1500)
            this.camera.camAngle.default()
        }
        this.camControls.toAboutMe = async () =>
        {
            this.sounds.playWhoosh()

            this.logic.lockButtons(1500)
            this.camera.camAngle.unlocked()
            this.camera.transitions.aboutMe(1.5)
            await this.sleep(1500)
            this.camera.camAngle.aboutMe()
        }
        this.camControls.toCredits = async () =>
        {
            this.sounds.playWhoosh()

            this.logic.lockButtons(1500)
            this.camera.camAngle.unlocked()
            this.camera.transitions.credits(1.5)
            await this.sleep(1500)
            this.camera.camAngle.credits()
        }
        this.camControls.toEasel = async () =>
        {
            this.sounds.playWhoosh()

            this.logic.lockButtons(1500)
            this.camera.camAngle.unlocked()
            this.camera.transitions.easel(1.5)
            await this.sleep(1500)
            this.camera.camAngle.easel()
        }
    }

    // video controls

    setVideoControls()
    {
        this.videoControls = {}

        this.videoControls.bigScreen = async () =>
        {
            console.log('bigScreen')
        }

        this.videoControls.littleTVScreen = async () =>
        {
            this.videoControls.togglePlayback(this.resources.video['littleTVScreenVideoTexture'])
        }

        this.videoControls.tallScreen = async () =>
        {
            this.videoControls.togglePlayback(this.resources.video['tallScreenVideoTexture'])
        }

        this.videoControls.tvScreen = async () =>
        {
            if(this.resources.video['tvScreenVideoTexture'].paused)
            {
                const p = this.resources.video['tvScreenVideoTexture'].play()
                if (p && typeof p.catch === 'function') p.catch(() => {})
            }
            else {
                window.open('https://www.youtube.com/watch?v=fYcphQibLek', '_blank');
                this.resources.video['tvScreenVideoTexture'].pause()
            }
        }

        this.videoControls.sideScreen = async () =>
        {

        }

        this.smallScreen1Counter = 1

        this.videoControls.smallScreen1 = async () =>
        { 
            if(this.smallScreen1Counter < this.resources.carousel1.length)
            {this.smallScreen1Counter++}
            else {this.smallScreen1Counter = 1}

            this.screenTransition(
                this.materials.smallScreen1Material,
                this.resources.carousel1[this.smallScreen1Counter-1],
                0.8
            )

            this.animations.photoCounter = 0
        }

        this.smallScreen2Counter = 1

        this.videoControls.smallScreen2 = async () =>
        {
            if(this.smallScreen2Counter < this.resources.carousel2.length)
            {this.smallScreen2Counter++}
            else {this.smallScreen2Counter = 1}

            this.screenTransition(
                this.materials.smallScreen2Material,
                this.resources.carousel2[this.smallScreen2Counter-1],
                0.8
            )

            this.animations.photoCounter = 0
        }

        this.videoControls.smallScreen3 = async () =>
        {
            this.videoControls.togglePlayback(this.resources.video['smallScreen3VideoTexture'])
        }

        this.videoControls.smallScreen4 = async () =>
        {
            this.videoControls.togglePlayback(this.resources.video['smallScreen4VideoTexture'])
        }

        this.videoControls.smallScreen5 = async () =>
        {
            this.videoControls.togglePlayback(this.resources.video['smallScreen5VideoTexture'])
        }

        this.videoControls.togglePlayback = async (video) =>
        {
            this.sounds.playBloop()
            if(video.paused)
            {
                const p = video.play()
                if (p && typeof p.catch === 'function') p.catch(() => {})
            }
            else {video.pause()}
        }


    }

    setSocialControls()
    {
        this.socialControls = {}
        this.socialControls.twitter = async () =>
        {
            if(this.logic.buttonsLocked === false && (this.logic.mode === 'aboutMe' || this.logic.mode === 'skills' || this.logic.mode === 'experience'))
            {
                window.open(portfolioData.links.resume, '_blank');
            }
            
        }

        this.socialControls.linkedIn = async () =>
        {
            if(this.logic.buttonsLocked === false && (this.logic.mode === 'aboutMe' || this.logic.mode === 'skills' || this.logic.mode === 'experience'))
            {
                window.open(portfolioData.links.linkedin, '_blank');
            }
            
        }

        this.socialControls.gitHub = async () =>
        {
            if(this.logic.buttonsLocked === false && (this.logic.mode === 'aboutMe' || this.logic.mode === 'skills' || this.logic.mode === 'experience'))
            {
                window.open(portfolioData.links.github, '_blank');
            }
            
        }

        this.socialControls.medium = async () =>
        {
            if(this.logic.buttonsLocked === false && (this.logic.mode === 'aboutMe' || this.logic.mode === 'skills' || this.logic.mode === 'experience'))
            {
                window.open(portfolioData.links.articles, '_blank');
            }
            
        }

        this.socialControls.mail = async () =>
        {
            if(this.logic.buttonsLocked === false && (this.logic.mode === 'aboutMe' || this.logic.mode === 'skills' || this.logic.mode === 'experience'))
            {
                window.location.href=`mailto:${portfolioData.email}`
            }
            
        }
    }

    screenTransition(material,newTexture, duration,)
    {
        material.uniforms.texture2.value = newTexture
        gsap.to(material.uniforms.progress, {value:1,
            duration: duration,
            ease: "power1.inOut",
            onComplete: () => {
                material.uniforms.texture1.value = newTexture
                material.uniforms.progress.value = 0
            }
        })
    }

    bigScreenTransition(material,newTexture, duration, toDefault)
    {
        material.uniforms.uTexture2IsDefault.value = toDefault ? 1 : 0

        material.uniforms.uTexture2.value = newTexture
        gsap.to(material.uniforms.uProgress, {value:1,
            duration: duration,
            ease: "power1.inOut",
            onComplete: () => {
                material.uniforms.uTexture1IsDefault.value = toDefault ? 1 : 0 
                material.uniforms.uTexture1.value = newTexture
                material.uniforms.uProgress.value = 0
                
            }
        })
    }

    sleep(ms) 
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
