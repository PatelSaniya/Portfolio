import * as THREE from 'three'
import Experience from '../Experience.js'


export default class RamenShop {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.materials = this.experience.materials

        // Debug
        if (this.debug.active) {
            // this.debugFolder = this.debug.ui.addFolder('ramenShop')
        }

        // Resource
        this.resource = this.resources.items.ramenShopModel

        this.parseModel()
        this.addObjects()
        this.setMaterials()
    }

    parseModel() {
        this.model = this.resource.scene

        // Objects
        this.ramenShop = this.model.children.find(child => child.name === 'ramenShopJoined')
        this.machines = this.model.children.find(child => child.name === 'machinesJoined')
        this.floor = this.model.children.find(child => child.name === 'floor')
        this.misc = this.model.children.find(child => child.name === 'miscJoined')
        this.graphics = this.model.children.find(child => child.name === 'graphicsJoined')
        this.legacyNamePlate = this.model.children.find(child => child.name === 'legacyNamePlate')
        this.skillsLabelText = this.model.children.find(child => child.name === 'skillsLabel_text')
        // Custom Blender-added text meshes — traverse the whole tree so we don't miss nested ones
        this.greenSquareCredits = null
        this.model.traverse((obj) => {
            if (obj.name === 'greenSquareCredits') this.greenSquareCredits = obj
        })

        // Moving Objects
        this.fan1 = this.model.children.find(child => child.name === 'fan1')
        this.fan2 = this.model.children.find(child => child.name === 'fan2')
        this.dish = this.model.children.find(child => child.name === 'dish')
        this.dishStand = this.model.children.find(child => child.name === 'dishStand')

        // Non-glow Lights
        this.projectsRed = this.model.children.find(child => child.name === 'projectsRed')
        this.projectsWhite = this.model.children.find(child => child.name === 'projectsWhite')
        this.articlesRed = this.model.children.find(child => child.name === 'articlesRed')
        this.articlesWhite = this.model.children.find(child => child.name === 'articlesWhite')
        this.easelSignBlack = this.model.children.find(child => child.name === 'easelSignBlack')
        this.easelSignPink = this.model.children.find(child => child.name === 'easelSignPink')
        this.aboutMeBlack = this.model.children.find(child => child.name === 'aboutMeBlack')
        this.aboutMeBlue = this.model.children.find(child => child.name === 'aboutMeBlue')
        this.creditsBlack = this.model.children.find(child => child.name === 'creditsBlack')
        this.creditsOrange = this.model.children.find(child => child.name === 'creditsOrange')
        this.greenSignSquare = this.model.children.find(child => child.name === 'greenSignSquare')
        this.blueLights = this.model.children.find(child => child.name === 'blueLights')
        this.yellowRightLight = this.model.children.find(child => child.name === 'yellowRightLight')
        this.whiteButton = this.model.children.find(child => child.name === 'whiteButton')
        this.redLED = this.model.children.find(child => child.name === 'redLED')
        this.greenLED = this.model.children.find(child => child.name === 'greenLED')


        // Glow Lights
        this.chinese = this.model.children.find(child => child.name === 'chinese')
        this.neonBlue = this.model.children.find(child => child.name === 'neonBlue')
        this.neonPink = this.model.children.find(child => child.name === 'neonPink')
        this.neonYellow = this.model.children.find(child => child.name === 'neonYellow')
        this.neonGreen = this.model.children.find(child => child.name === 'neonGreen')
        this.portalLight = this.model.children.find(child => child.name === 'portalLight')
        this.storageLight = this.model.children.find(child => child.name === 'storageLight')
        this.poleLight = this.model.children.find(child => child.name === 'poleLight')
        this.arcadeRim = this.model.children.find(child => child.name === 'arcadeRim')
        this.vendingMachineLight = this.model.children.find(child => child.name === 'vendingMachineLight')
        this.arcadeToken = this.model.children.find(child => child.name === 'arcadeToken')
        this.lampLights = this.model.children.find(child => child.name === 'lampLights')

        // Screens
        this.bigScreen = this.model.children.find(child => child.name === 'bigScreen')
        this.tallScreen = this.model.children.find(child => child.name === 'tallScreen')
        this.sideScreen = this.model.children.find(child => child.name === 'sideScreen')
        this.arcadeScreen = this.model.children.find(child => child.name === 'arcadeScreen')
        this.tvScreen = this.model.children.find(child => child.name === 'tvScreen')
        this.littleTVScreen = this.model.children.find(child => child.name === 'littleTVScreen')

        this.vendingMachineScreen = this.model.children.find(child => child.name === 'vendingMachineScreen')

        this.smallScreen1 = this.model.children.find(child => child.name === 'smallScreen1')
        this.smallScreen2 = this.model.children.find(child => child.name === 'smallScreen2')
        this.smallScreen3 = this.model.children.find(child => child.name === 'smallScreen3')
        this.smallScreen4 = this.model.children.find(child => child.name === 'smallScreen4')
        this.smallScreen5 = this.model.children.find(child => child.name === 'smallScreen5')

        this.easelFrontGraphic = this.model.children.find(child => child.name === 'easelFrontGraphic')

    }

    addObjects() {
        this.hologramBaseGeometry = new THREE.CircleGeometry(.68, 32)

        // Try to find the Blender-authored skillsSignPlate first
        this.skillsSignPlate = null
        this.model.traverse((obj) => {
            if (obj.name === 'skillsSignPlate') this.skillsSignPlate = obj
        })

        // Fall back to a programmatic orange plate sized to the skills sign's inner frame opening.
        // Inner frame measured from miscJoined: w=1.155, h=0.185, centered at Blender (-4.127, 5.018, 0.727).
        if (!this.skillsSignPlate) {
            this.skillsSignPlate = new THREE.Mesh(
                new THREE.PlaneGeometry(1.155, 0.185),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color('#ff8a1c'),
                    side: THREE.DoubleSide,
                })
            )
            this.skillsSignPlate.name = 'skillsSignPlate'
            this.skillsSignPlate.rotation.y = Math.PI / 2
            // Three.js coords (model-local): blender (-4.127, 5.018, 0.727) → (-4.127, 0.727, -5.018)
            this.skillsSignPlate.position.set(-4.127, 0.727, -5.018)
            this.model.add(this.skillsSignPlate)
        }
    }

    setMaterials() {
        // Helper — safely set a property on a possibly-missing mesh (skips if mesh was removed from GLTF)
        const setMat = (obj, mat) => { if (obj) obj.material = mat }
        const setHidden = (obj) => { if (obj) obj.visible = false }

        // Set Materials
        this.resources.on('texturesMapped', () => {
            // Objects
            setMat(this.ramenShop, this.materials.ramenShopMaterial)
            setMat(this.machines, this.materials.machinesMaterial)
            setMat(this.floor, this.materials.floorMaterial)
            setMat(this.misc, this.materials.miscMaterial)
            setMat(this.graphics, this.materials.graphicsMaterial)
            setHidden(this.legacyNamePlate)

            // Moving Objects
            setMat(this.fan1, this.materials.fanMatcapMaterial)
            setMat(this.fan2, this.materials.fanMatcapMaterial)
            setMat(this.dish, this.materials.dishMatcapMaterial)
            setMat(this.dishStand, this.materials.dishMatcapMaterial)

            // Non-glow Lights
            setMat(this.projectsRed, this.materials.redSignMaterial)
            setMat(this.projectsWhite, this.materials.whiteSignMaterial)
            setMat(this.articlesWhite, this.materials.whiteSignMaterial)
            setMat(this.articlesRed, this.materials.redSignMaterial)
            setMat(this.easelSignBlack, this.materials.blackSignMaterial)
            setMat(this.easelSignPink, this.materials.pinkSignMaterial)
            setHidden(this.easelSignBlack)
            setHidden(this.easelSignPink)
            setMat(this.skillsLabelText, this.materials.blackSignMaterial)
            setMat(this.aboutMeBlack, this.materials.blackSignMaterial)
            setMat(this.aboutMeBlue, this.materials.blueSignMaterial)
            setMat(this.creditsBlack, this.materials.blackSignMaterial)
            setMat(this.creditsOrange, this.materials.orangeSignMaterial)
            // Keep the orange arrow shape, hide just the credits text shadow layer
            setHidden(this.creditsBlack)
            // Black material for the custom credits text on the green panel — FrontSide only so it doesn't show through the back
            if (this.greenSquareCredits) {
                // Text was readable from the back — render BackSide so the visible front shows the text,
                // and nudge the mesh slightly forward (toward the green panel front) so it sits on top.
                this.greenSquareCredits.material = new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    side: THREE.BackSide,
                })
                this.greenSquareCredits.material.polygonOffset = true
                this.greenSquareCredits.material.polygonOffsetFactor = -1
                this.greenSquareCredits.material.polygonOffsetUnits = -1
            }
            // Ensure the orange plate has its material (Blender-authored mesh might come in with a default).
            if (this.skillsSignPlate && (!this.skillsSignPlate.material || !this.skillsSignPlate.material.isMeshBasicMaterial)) {
                this.skillsSignPlate.material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color('#ff8a1c'),
                    side: THREE.DoubleSide,
                })
            }
            setMat(this.greenSignSquare, this.materials.greenSignMaterial)
            setMat(this.blueLights, this.materials.blueSignMaterial)
            setMat(this.yellowRightLight, this.materials.orangeSignMaterial)
            setMat(this.whiteButton, this.materials.whiteSignMaterial)
            setMat(this.redLED, this.materials.redLedMaterial)
            setMat(this.greenLED, this.materials.greenLedMaterial)

            // Glow lights
            setMat(this.chinese, this.materials.greenSignMaterial)
            setMat(this.neonBlue, this.materials.neonBlueMaterial)
            setMat(this.neonPink, this.materials.neonPinkMaterial)
            setMat(this.neonYellow, this.materials.neonYellowMaterial)
            setMat(this.neonGreen, this.materials.neonGreenMaterial)
            setMat(this.portalLight, this.materials.neonBlueMaterial)
            setMat(this.storageLight, this.materials.neonBlueMaterial)
            setMat(this.poleLight, this.materials.poleLightMaterial)
            setMat(this.arcadeRim, this.materials.neonBlueMaterial)
            setMat(this.vendingMachineLight, this.materials.whiteSignMaterial)
            setMat(this.arcadeToken, this.materials.redLedMaterial)
            setMat(this.lampLights, this.materials.whiteSignMaterial)

            // Screens
            setMat(this.bigScreen, this.materials.bigScreenMaterial)
            setMat(this.arcadeScreen, this.materials.arcadeScreenMaterial)
            setMat(this.littleTVScreen, this.materials.littleTVScreenVideoMaterial)
            setMat(this.tallScreen, this.materials.tallScreenVideoMaterial)
            setMat(this.tvScreen, this.materials.tvScreenVideoMaterial)
            setMat(this.sideScreen, this.materials.sideScreenMaterial)

            setMat(this.smallScreen1, this.materials.smallScreen1Material)
            setMat(this.smallScreen2, this.materials.smallScreen2Material)

            setMat(this.smallScreen3, this.materials.smallScreen3VideoMaterial)
            setMat(this.smallScreen4, this.materials.smallScreen4VideoMaterial)
            setMat(this.smallScreen5, this.materials.smallScreen5VideoMaterial)

            setMat(this.vendingMachineScreen, this.materials.vendingMachineScreenMaterial)

            // ShaderMaterials

            this.hologramBase = new THREE.Mesh(this.hologramBaseGeometry, this.materials.hologramBaseMaterial)
            this.hologramBase.position.x = -0.13
            this.hologramBase.position.y = 2.15
            this.hologramBase.position.z = -0.95
            this.hologramBase.rotation.x = Math.PI * -0.5
            this.scene.add(this.hologramBase)

            if (this.debug.active) {
                this.debugFolder = this.debug.ui.addFolder('hologramBasePosition')
                this.debugFolder.add(this.hologramBase.position, 'x').min(-10).max(10).step(0.001).name('x')
                this.debugFolder.add(this.hologramBase.position, 'y').min(-10).max(10).step(0.001).name('y')
                this.debugFolder.add(this.hologramBase.position, 'z').min(-10).max(10).step(0.001).name('z')

            }
        })
        this.model.position.y = - 3
        this.scene.add(this.model)
    }

    setEaselMaterial() {
        this.materials = this.experience.materials
        this.easelFrontGraphic.material = this.materials.easelMaterial
    }

    setEaselTexture(texture) {
        if (this.easelFrontGraphic && this.easelFrontGraphic.material) {
            this.easelFrontGraphic.material.map = texture
            this.easelFrontGraphic.material.needsUpdate = true
        }
    }
}
