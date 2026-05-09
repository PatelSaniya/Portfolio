import * as THREE from 'three'
import Experience from '../Experience.js'
import { portfolioData } from '../../portfolioData.js'

export default class Hologram
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.preLoader = this.experience.preLoader
        this.sounds = this.experience.sounds

        // Debug
        if(this.debug.active)
        {
            // this.debugFolder = this.debug.ui.addFolder('hologram')
        }

        // Resource
        this.ramenHologram = this.resources.items.ramenHologram
        this.update = function update() {}

        this.animate = true
        this.positions = this.combineBuffer( this.ramenHologram.scene, 'position' )
        this.createMesh( this.positions, this.scene, 0.0225, -0.1, 2, -0.95 )


        this.started = false
        this.preLoader.on('start', () => 
        {
            window.setTimeout(()=>{
                this.mesh.visible = true
                this.raiseHologram()
            }, 100)
            this.started = true

            
        })

    }

    combineBuffer( model, bufferName ) 
    {
        this.totalCount = 0;
    
        model.traverse( ( child ) => {
    
            if ( child.isMesh ) {
                
                this.buffer = child.geometry.attributes[ bufferName ];
    
                this.totalCount += this.buffer.array.length;
            }
    
        } );
    
        this.combined = new Float32Array( this.totalCount );
    
        this.offset = 0;
    
        model.traverse(( child ) => {
    
            if ( child.isMesh ) {
    
                this.buffer = child.geometry.attributes[ bufferName ];
    
                this.combined.set( this.buffer.array, this.offset );
                this.offset += this.buffer.array.length;
            }
        } );
    
        return new THREE.BufferAttribute( this.combined, 3 );
    }

    createMesh( positions, scene, scale, x, y, z ) {

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute( 'position', positions.clone() );
        this.geometry.setAttribute( 'initialPosition', positions.clone() );
    
        this.geometry.attributes.position.setUsage( THREE.DynamicDrawUsage );

        this.mesh = new THREE.Points( this.geometry, new THREE.PointsMaterial( { size: .01, color: new THREE.Color( 0x00ffff ) } ) );
        this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = scale;
    
        this.mesh.position.x = x 
        this.mesh.position.y = y 
        this.mesh.position.z = z 
    
        this.mesh.visible = false
        scene.add( this.mesh );
        this.createPortfolioFloorLabel(scene)
        
        this.data = {
            mesh: this.mesh, verticesDown: 0, verticesUp: 0, direction: 0, speed: 15, delay: 500,
            start: 10,
        }

        this.enableUpdate()
        

    }

    createPortfolioFloorLabel(scene)
    {
        const canvas = document.createElement('canvas')
        canvas.width = 1200
        canvas.height = 700
        const context = canvas.getContext('2d')

        context.clearRect(0, 0, canvas.width, canvas.height)
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.shadowColor = '#66f7ff'
        context.shadowBlur = 22
        context.fillStyle = '#ffffff'
        context.font = '900 88px Arial, Helvetica, sans-serif'
        context.fillText(`${portfolioData.name}'s Skills`, canvas.width / 2, 100)

        context.shadowBlur = 10
        context.fillStyle = 'rgba(255,255,255,0.86)'
        context.font = '700 38px Arial, Helvetica, sans-serif'
        const lines = portfolioData.softSkills

        lines.forEach((line, index) =>
        {
            context.fillText(line, canvas.width / 2, 190 + index * 62)
        })

        const texture = new THREE.CanvasTexture(canvas)
        texture.encoding = THREE.sRGBEncoding
        texture.needsUpdate = true

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1,
            alphaTest: 0.08,
            side: THREE.DoubleSide,
            depthWrite: false
        })

        this.floorLabel = new THREE.Mesh(new THREE.PlaneGeometry(3.9, 2.25), material)
        this.floorLabel.position.set(0.5, -2.93, -1.82)
        this.floorLabel.rotation.x = -Math.PI / 2
        this.floorLabel.rotation.z = Math.PI / 2 - 0.28
        scene.add(this.floorLabel)
    }

    raiseHologram()
    {
        this.resetPositionsToInitial()
        this.mesh.visible = true
        this.data.direction = 0
        this.data.speed = 5
        this.data.verticesDown = 0
        this.data.verticesUp = this.count || this.data.mesh.geometry.attributes.position.count
        this.data.delay = 0
    }

    resetPositionsToInitial()
    {
        const positions = this.data.mesh.geometry.attributes.position
        const initialPositions = this.data.mesh.geometry.attributes.initialPosition

        for(let i = 0; i < positions.count; i++)
        {
            positions.setXYZ(
                i,
                initialPositions.getX(i),
                initialPositions.getY(i),
                initialPositions.getZ(i)
            )
        }

        positions.needsUpdate = true
    }

    breakHologram()
    {
        if ( this.animate === true) {
            this.mesh.visible = true
            this.sounds.playHologram()
            this.data.direction = - 1;
            this.data.speed = 15;
            this.data.verticesDown = 0;
            this.data.verticesUp = 0;
            this.data.delay = 50;
        }
    }

    enableUpdate()
    {
        // Update Function
        this.update = function update() {

            // Mesh drop and Rise
            this.positions = this.data.mesh.geometry.attributes.position;
            this.initialPositions = this.data.mesh.geometry.attributes.initialPosition;

            this.count = this.positions.count;

            if ( this.data.start > 0 ) {

                this.data.start -= 1;

            } else {

                
                if ( this.data.direction === 0 && this.started === false) {
                    this.data.direction = - 1;
                }

            }

            let verticesDown = 0
            let verticesUp = 0

            for ( let i = 0; i < this.count; i ++ ) {

                this.px = this.positions.getX( i );
                this.py = this.positions.getY( i );
                this.pz = this.positions.getZ( i );

                // falling down
                if ( this.data.direction < 0 ) {

                    if ( this.py > 0 ) {

                        this.positions.setXYZ(
                            i,
                            this.px + 1.5 * ( 0.50 - Math.random() ) * this.data.speed * this.time.delta * 0.01,
                            this.py + 3.0 * ( 0.25 - Math.random() ) * this.data.speed * this.time.delta * 0.01,
                            this.pz + 1.5 * ( 0.50 - Math.random() ) * this.data.speed * this.time.delta * 0.01
                        );

                    } else {

                        verticesDown += 1;

                    }

                }

                // rising up
                if ( this.data.direction > 0 ) {

                    this.ix = this.initialPositions.getX( i );
                    this.iy = this.initialPositions.getY( i );
                    this.iz = this.initialPositions.getZ( i );

                    this.dx = this.ix - this.px;
                    this.dy = this.iy - this.py;
                    this.dz = this.iz - this.pz;

                    this.d = Math.sqrt(this.dx * this.dx + this.dy * this.dy + this.dz * this.dz);

                    if ( this.d > 0.01 ) {
                        const returnSpeed = Math.min(0.22, this.data.speed * this.time.delta * 0.0007)
                        const jitter = 0.88 + Math.random() * 0.24
                        this.positions.setXYZ(
                            i,
                            this.px + this.dx * returnSpeed * jitter,
                            this.py + this.dy * returnSpeed * jitter,
                            this.pz + this.dz * returnSpeed * jitter
                        );

                    } else {

                        this.positions.setXYZ(i, this.ix, this.iy, this.iz)
                        verticesUp += 1;

                    }

                }

            }

            this.data.verticesDown = verticesDown
            this.data.verticesUp = verticesUp

            // all vertices down (go up)

            if ( this.data.verticesDown >= this.count && this.animate === true) {
                if ( this.data.delay <= 0 ) {

                    this.data.direction = 1;
                    this.data.speed = 5;
                    this.data.verticesDown = 0;
                    // this.data.delay = 1000;

                } else {

                    this.data.delay -= 1;

                }

            }

            if ( this.data.direction > 0 && this.data.verticesUp >= this.count && this.animate === true) {
                this.resetPositionsToInitial()
                this.data.direction = 0
                this.data.verticesUp = this.count
            }

            // all vertices up (go down)

            // if ( this.data.verticesUp >= this.count && this.animate === true) {

            //     if ( this.data.delay <= 0 ) {

            //         this.data.direction = - 1;
            //         this.data.speed = 15;
            //         this.data.verticesUp = 0;
            //         this.data.delay = 20;

            //     } else {

            //         this.data.delay -= 1;

            //     }

            // }

            this.positions.needsUpdate = true;

        }
    }
    
}
