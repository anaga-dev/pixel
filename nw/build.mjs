import nwbuild from 'nw-builder'

try {
  const result = await nwbuild({
    app: {
      name: "anaga.pixel",
      version: "1.0.0",
      company: "anaga",
      fileDescription: "pixel",
      productName: "Anaga Pixel",
      legalCopyright: "Copyright (c) 2023",
      icon: "./icons/icon.ico",
    },
    zip: false,
    srcDir: "./main.js ./package.json",
    mode: "build",
    version: "stable",
    flavor: "normal",
    platform: "linux",
    arch: "x64", 
    outDir: "./out",
    cacheDir: "./cache",
  })
  console.log(result)
} catch (error) {
  console.error(error)
}
