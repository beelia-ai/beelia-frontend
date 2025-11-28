# 3D Models Required

This directory should contain the following GLB files for the FluidGlass component:

- `lens.glb` - Lens-shaped glass model
- `bar.glb` - Bar-shaped glass model  
- `cube.glb` - Cube-shaped glass model

## Usage

Once the GLB files are placed in this directory, you can use the FluidGlass component like this:

```tsx
import FluidGlass from '@/components/ui/fluid-glass'

<div style={{ height: '600px', position: 'relative' }}>
  <FluidGlass 
    mode="lens" // or "bar", "cube"
    lensProps={{
      scale: 0.25,
      ior: 1.15,
      thickness: 5,
      chromaticAberration: 0.1,
      anisotropy: 0.01  
    }}
    barProps={{}} // add specific props if using bar mode
    cubeProps={{}} // add specific props if using cube mode
  />
</div>
```

## Note

The component will not function correctly until these GLB files are added to this directory.

