import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

const faces = [
    {
        name: 'a',
        rotate: 'z',
        direction: { x: 0, y: 0, z: -1 },
    },
    {
        name: 'e',
        rotate: 'x',
        invertRanks: true,
        direction: { x: 0, y: -1, z: 0 },
    },
    {
        name: 'f',
        rotate: 'z',
        invertRanks: true,
        direction: { x: 0, y: 0, z: +1 },
    },
    {
        name: 'd',
        rotate: 'x',
        direction: { x: 0, y: +1, z: 0 },
    },
    {
        name: 'b',
        full: true,
        rotate: 'y',
        direction: { x: -1, y: 0, z: 0 },
    },
    {
        name: 'c',
        full: true,
        rotate: 'y',
        direction: { x: +1, y: 0, z: 0 },
    }
];

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0x6f6f6f, 0.5);
light.position.set(2, 5, 2); //default; light shining from top
light.castShadow = true; // default false
scene.add(light);

light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

// const helper = new THREE.CameraHelper( light.shadow.camera );
// scene.add(helper);

const cellCount = 5;
const color1 = 0xF0E8E7, color2 = 0x985650;

let color = color2;

const min = -cellCount / 2 + 0.5;
const max = +cellCount / 2 - 0.5;

const distance = cellCount / 2;

const cells = [];

for (const i in faces) {
    const face = faces[i];

    if (face.full) {
        const geometry = new THREE.PlaneGeometry(cellCount, cellCount);
        const material = new THREE.MeshStandardMaterial({ emissive: 0x000000, side: THREE.DoubleSide});
        const plane = new THREE.Mesh(geometry, material);

        plane.receiveShadow = true;
        plane.rotation[face.rotate] = 90 * (Math.PI / 180);

        for (const axis of ['x', 'y', 'z']) {
            if (face.direction[axis]) {
                plane.position[axis] = face.direction[axis] * distance;
            }
        }

        scene.add(plane);
        continue;
    }

    for (let a = min, file = 1; a <= max; a++, file++) {
        for (let b = min, rank = face.invertRanks ? cellCount : 1; b <= max; b++, face.invertRanks ? rank-- : rank++) {
            const geometry = new THREE.PlaneGeometry(1, 1);
            const material = new THREE.MeshStandardMaterial({ emissive: color, side: THREE.DoubleSide});
            const plane = new THREE.Mesh(geometry, material);

            plane.receiveShadow = true;
            plane.rotation[face.rotate] = 90 * (Math.PI / 180);

            let c = a;
            for (const axis of ['x', 'y', 'z']) {
                if (face.direction[axis]) {
                    plane.position[axis] = face.direction[axis] * distance;
                    continue;
                }

                plane.position[axis] = c;
                c = b;
            }
            scene.add(plane);

            const cell = { face: face.name, rank, file, plane };
            createIndicator(cell);
            cells.push(cell);

            color = color === color1 ? color2 : color1;
        }
        if (cellCount % 2 === 0) color = color === color1 ? color2 : color1;
    }
    if (cellCount % 2 === 0 && i % 2 === 0) color = color === color1 ? color2 : color1;
}

/*
{
    const points = [];
    points.push(new THREE.Vector3(-100, 0, 0));
    points.push(new THREE.Vector3( 100, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0xff0000}));
    scene.add(line);
}
{
    const points = [];
    points.push(new THREE.Vector3(0, -100, 0));
    points.push(new THREE.Vector3(0,  100, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x00ff00}));
    scene.add(line);
}
{
    const points = [];
    points.push(new THREE.Vector3(0, 0, -100));
    points.push(new THREE.Vector3(0, 0,  100));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x0000ff}));
    scene.add(line);
}
*/

function createIndicator(cell) {
    const face = faces.find(face => face.name === cell.face);

    const geometry = new THREE.SphereGeometry(0.15, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x606060 });
    const sphere = new THREE.Mesh(geometry, material);

    sphere.rotation[face.rotate] = 90 * (Math.PI / 180);
    sphere.position.set(cell.plane.position.x, cell.plane.position.y, cell.plane.position.z);

    sphere.visible = false;

    scene.add(sphere);
    cell.indicator = sphere;
}

const controls = new OrbitControls(camera, renderer.domElement);
{
    camera.position.set(cellCount, cellCount, -cellCount * 2);
    // controls.autoRotate = true;
    controls.autoRotateSpeed = 20;
    controls.enablePan = false;
    controls.minDistance = cellCount;
    controls.maxDistance = cellCount * 4;
    controls.mouseButtons = {
        RIGHT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY
    };
}

const pieces = [];

// FRONT (White)
for (let file = 1; file <= cellCount; ++file) {
    const rank = 2;

    const cell = cells.find(cell => cell.face === 'a' && cell.rank === rank && cell.file === file);
    const piece = createPiece(cell, 0xe1e1e1, pawnGeometry, 'P');
    piece.direction = 1;
}

// BOTTOM (White)
for (let file = 1; file <= cellCount; ++file) {
    const rank = cellCount - 1;

    const cell = cells.find(cell => cell.face === 'e' && cell.rank === rank && cell.file === file);
    const piece = createPiece(cell, 0xe1e1e1, pawnGeometry, 'P');
    piece.direction = -1;
}

// createPiece(findCell('a', 1, 1), 0xe1e1e1, rookGeometry, 'R');
// createPiece(findCell('a', cellCount, 1), 0xe1e1e1, rookGeometry, 'R');
// createPiece(findCell('e', 1, cellCount), 0xe1e1e1, rookGeometry, 'R');
// createPiece(findCell('e', cellCount, cellCount), 0xe1e1e1, rookGeometry, 'R');

// BACK (Black)
for (let file = 1; file <= cellCount; ++file) {
    const rank = 2;

    const cell = cells.find(cell => cell.face === 'f' && cell.rank === rank && cell.file === file);
    const piece = createPiece(cell, 0x1f1f1f, pawnGeometry, 'p');
    piece.direction = 1;
}

// TOP (Black)
for (let file = 1; file <= cellCount; ++file) {
    const rank = cellCount - 1;

    const cell = cells.find(cell => cell.face === 'd' && cell.rank === rank && cell.file === file);
    const piece = createPiece(cell, 0x1f1f1f, pawnGeometry, 'p');
    piece.direction = -1;
}

// createPiece(findCell('f', 1, 1), 0x1f1f1f, rookGeometry, 'r');
// createPiece(findCell('f', cellCount, 1), 0x1f1f1f, rookGeometry, 'r');
// createPiece(findCell('d', 1, cellCount), 0x1f1f1f, rookGeometry, 'r');
// createPiece(findCell('d', cellCount, cellCount), 0x1f1f1f, rookGeometry, 'r');

function pawnGeometry(color, width = 0.6, height = 0.3) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ emissive: color });
    const mesh = new THREE.Mesh(geometry, material);

    geometry.scale(width, width, height);

    return { width, height, mesh };
}

function rookGeometry(color, width = 0.8, height = 0.8) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ emissive: color });
    const mesh = new THREE.Mesh(geometry, material);

    geometry.scale(width, width, height);

    return { width, height, mesh };
}

function createPiece(cell, color, geometry, name) {
    const { width, height, mesh } = geometry(color);

    const face = faces.find(face => face.name === cell.face);

    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.rotation[face.rotate] = 90 * (Math.PI / 180);

    mesh.position.x = cell.plane.position.x;
    mesh.position.y = cell.plane.position.y;
    mesh.position.z = cell.plane.position.z;

    const direction = Object.entries(face.direction).find(entry => entry[1]);

    if (direction[1] > 0) mesh.position[direction[0]] += height / 2;
    if (direction[1] < 0) mesh.position[direction[0]] -= height / 2;

    scene.add(mesh);

    const piece = { name, cell, mesh, width, height, color };
    pieces.push(piece);
    return piece;
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let selectedPiece;
let selectedPieceOrigin;
let moves = [];

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (!selectedPiece) return;

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children.filter(child => !pieces.find(piece => piece.mesh === child)));

    if (!intersects[0]) return;

    const cell = cells.find(cell => cell.plane === intersects[0].object);

    if (!cell || (!moves.includes(cell) && selectedPieceOrigin !== cell)) return;

    pieces.forEach(piece => piece.mesh.visible = true);

    const currentPiece1 = pieces.find(piece => piece.cell === cell && piece !== selectedPiece);
    if (currentPiece1) currentPiece1.mesh.visible = false;

    const currentPiece2 = pieces.find(piece => piece.cell === selectedPiece.cell && piece !== selectedPiece);
    if (currentPiece2) currentPiece2.mesh.visible = false;

    const face = faces.find(face => face.name === cell.face);
    const mesh = selectedPiece.mesh;

    mesh.rotation.set(0, 0, 0);
    mesh.rotation[face.rotate] = 90 * (Math.PI / 180);

    mesh.position.x = cell.plane.position.x;
    mesh.position.y = cell.plane.position.y;
    mesh.position.z = cell.plane.position.z;

    const direction = Object.entries(face.direction).find(entry => entry[1]);

    if (direction[1] > 0) mesh.position[direction[0]] += selectedPiece.height / 2;
    if (direction[1] < 0) mesh.position[direction[0]] -= selectedPiece.height / 2;

    selectedPiece.cell = cell;
}

function onPointerDown(event) {
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    if (!intersects[0]) return;

    const piece = pieces.find(piece => piece.mesh === intersects[0].object);

    if (!piece) return;

    selectedPieceOrigin = piece.cell;
    selectedPiece = piece;
    selectedPiece.mesh.material.color.set(0xffff00);

    moves = validMoves(selectedPiece);

    moves.forEach(cell => {
        cell.indicator.visible = true;
        const occupied = pieces.find(piece => piece.cell === cell);
        if (occupied) occupied.mesh.material.color.set(0xff0000);
    });
}

function onPointerUp(event) {
    cells.forEach(cell => cell.indicator.visible = false);
    pieces.forEach(piece => piece.mesh.material.color.set(piece.color));
    pieces.forEach(piece => piece.mesh.visible = true);

    if (!selectedPiece) return;

    if (selectedPiece.cell !== selectedPieceOrigin) selectedPiece.moved = true;

    selectedPiece.mesh.material.color.set(selectedPiece.color);
    selectedPiece = null;
}

window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointerup', onPointerUp);

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    light.position.set(camera.position.x + 1, camera.position.y + 1, camera.position.z - 1);

    renderer.render(scene, camera);
}
animate();

let flattenedRank = 1;

for (const face of faces.reverse()) {
    if (face.full) continue;

    for (let rank = 1; rank <= cellCount; ++rank) {
        for (let file = 1; file <= cellCount; ++file) {
            const cell = cells.find(cell => cell.face === face.name && cell.rank === rank && cell.file === file);

            cell.flattenedRank = flattenedRank;
        }
        flattenedRank++;
    }
}

function findCell(face, file, rank) {
    return cells.find(cell => cell.face === face && cell.file === file && cell.rank === rank);
}

function validMoves(piece) {
    const moves = [];

    if (piece.name.toUpperCase() === 'P') {
        let nextRank = piece.cell.flattenedRank + piece.direction;
        if (nextRank > cellCount * 4) nextRank = 1;
        if (nextRank < 1) nextRank = cellCount * 4;

        let nextCell = cells.find(cell => cell.file === piece.cell.file && cell.flattenedRank === nextRank);
        const occupied = pieces.find(piece => piece.cell === nextCell);

        if (!occupied) moves.push(nextCell);

        if (!piece.moved && !occupied) {
            let nextRank2 = nextRank + piece.direction;
            if (nextRank2 > cellCount * 4) nextRank2 = 1;
            if (nextRank2 < 1) nextRank2 = cellCount * 4;

            let nextCell2 = cells.find(cell => cell.file === piece.cell.file && cell.flattenedRank === nextRank2);
            const occupied2 = pieces.find(piece => piece.cell === nextCell2);

            if (!occupied2) moves.push(nextCell2);
        }

        let attackCell1 = cells.find(cell => cell.file === piece.cell.file - 1 && cell.flattenedRank === nextRank);
        let attackCell2 = cells.find(cell => cell.file === piece.cell.file + 1 && cell.flattenedRank === nextRank);

        const attackOccupied1 = pieces.find(piece => piece.cell === attackCell1);
        const attackOccupied2 = pieces.find(piece => piece.cell === attackCell2);

        if (attackOccupied1 && attackOccupied1.color !== piece.color) moves.push(attackCell1);
        if (attackOccupied2 && attackOccupied2.color !== piece.color) moves.push(attackCell2);
    }

    return moves;
}
console.log(cells + '35');
