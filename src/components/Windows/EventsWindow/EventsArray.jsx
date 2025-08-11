const imagesByFolder = {
  "srcEvents" : import.meta.glob('./srcEvents/*.{png,jpg,jpeg,svg}'),
  "2003-2004" : import.meta.glob('./2003-2004/*.{png,jpg,jpeg,svg}'),
  "2005-2007" : import.meta.glob('./2005-2007/*.{png,jpg,jpeg,svg}'),
  "2008-2010" : import.meta.glob('./2008-2010/*.{png,jpg,jpeg,svg}'),
  "2011-2013" : import.meta.glob('./2011-2013/*.{png,jpg,jpeg,svg}'),
  "2014-2015" : import.meta.glob('./2014-2015/*.{png,jpg,jpeg,svg}'),
}
export async function loadImgFromFolder(folderName) {
  const folderImports = imagesByFolder[folderName];
  const filePath = Object.keys(folderImports)
  const modules = await Promise.all(filePath.map(path => folderImports[path]()));

  return modules.map((mod, idx) => {
    const path = filePath[idx]
    const fileName = path.split('/').pop()
    const nameWithoutExt = fileName.replace(/\.(png|jpe?g|svg)$/i, '').toLowerCase()

    return {
      image: mod.default,
      name: nameWithoutExt,
    };
  })
}