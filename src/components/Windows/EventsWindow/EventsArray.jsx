const imagesByFolder = {
  "srcEvents" : import.meta.glob('./srcEvents/*.{png,jpg,jpeg,svg,JPG}'),
  "2003-2004" : import.meta.glob('./2003-2004/*.{png,jpg,jpeg,svg,JPG}'),
  "2005-2007" : import.meta.glob('./2005-2007/*.{png,jpg,jpeg,svg,JPG}'),
  "2008-2010" : import.meta.glob('./2008-2010/*.{png,jpg,jpeg,svg,JPG}'),
  "2011-2013" : import.meta.glob('./2011-2013/*.{png,jpg,jpeg,svg,JPG}'),
  "2014-2015" : import.meta.glob('./2014-2015/*.{png,jpg,jpeg,svg,JPG}'),
  "2016-2017" : import.meta.glob('./2016-2017/*.{png,jpg,jpeg,svg,JPG}'),
  "2018" : import.meta.glob('./2018/*.{png,jpg,jpeg,svg,JPG}'),
  "2019-2020" : import.meta.glob('./2019-2020/*.{png,jpg,jpeg,svg,JPG}'),
  "2021-2022" : import.meta.glob('./2021-2022/*.{png,jpg,jpeg,svg,JPG}'),
  "2023" : import.meta.glob('./2023/*.{png,jpg,jpeg,svg,JPG}'),
  "2024" : import.meta.glob('./2024/*.{png,jpg,jpeg,svg,JPG}'),
  "2025" : import.meta.glob('./2025/*.{png,jpg,jpeg,svg,JPG}'),
  "Выездное совещание в Совете ветеранов ЗАО" : import.meta.glob('./Выездное совещание  в Совете ветеранов ЗАО/*.{png,jpg,jpeg,svg,JPG}'),
  "Заседание медицинской комиссии МГСВ" : import.meta.glob('./Заседание медицинской комиссии МГСВ/*.{png,jpg,jpeg,svg,JPG}'),
  "Инструктивно-методическое занятие" : import.meta.glob('./Инструктивно-методическое занятие/*.{png,jpg,jpeg,svg,JPG}'),
  "Конкурс на лучшую районную медкомиссию" : import.meta.glob('./Конкурс на лучшую районную медкомиссию/*.{png,jpg,jpeg,svg,JPG}'),
  "Конкурс-выставка цветов" : import.meta.glob('./Конкурс-выставка цветов/*.{png,jpg,jpeg,svg,JPG}'),
  "Круглый стол Никто, кроме нас" : import.meta.glob('./Круглый стол Никто, кроме нас/*.{png,jpg,jpeg,svg,JPG}'),
  "Участие в показе фильма об участниках СВО" : import.meta.glob('./Участие в показе фильма об участниках СВО/*.{png,jpg,jpeg,svg,JPG}'),
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