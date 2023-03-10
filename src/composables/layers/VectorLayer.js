import { v4 as uuid } from 'uuid'
import { ref, shallowReactive } from 'vue'

export function create({
  name: initialName = 'Unnamed',
  visible: initialVisible = true
} = {}) {
  const id = ref(uuid())
  const name = ref(initialName)
  const visible = ref(initialVisible)
  const vertices = shallowReactive([
    [-64, -64],
    [ 64, -64],
    [ 64,  64],
    [-64,  64]
  ])
  const walls = shallowReactive([
    {
      vertices: [0, 1]
    },
    {
      vertices: [1, 2]
    },
    {
      vertices: [2, 3]
    },
    {
      vertices: [3, 0]
    }
  ])
  const sectors = shallowReactive([
    {
      walls: [0, 1, 2, 3],
      planes: [{}] // floor, ceiling
    }
  ])
  const spawns = shallowReactive([])
  return {
    id,
    name,
    visible,
    vertices,
    walls,
    sectors,
    spawns,
  }
}

export function duplicate({
  name: initialName,
  visible: initialVisible,
  vertices: initialVertices,
  walls: initialWalls,
  sectors: initialSectors,
  spawns: initialSpawns
}) {
  const id = ref(uuid())
  const name = ref(initialName)
  const visible = ref(initialVisible)
  const vertices = shallowReactive(initialVertices)
  const walls = shallowReactive(initialWalls)
  const sectors = shallowReactive(initialSectors)
  const spawns = shallowReactive(initialSpawns)
  return {
    id,
    name,
    visible,
    vertices,
    walls,
    sectors,
    spawns
  }
}

export default {
  create,
  duplicate
}
