const images = import.meta.glob('./srcEvents/*.{png,jpg,jpeg,svg}');

const eventsArray = [];

for (const path in images) {
  const fileName = path.split('/').pop();
  const nameWithoutExt = fileName.replace(/\.(png|jpe?g|svg)$/, '');

  images[path]().then((module) => {
    eventsArray.push({
      image: module.default,
      name: nameWithoutExt,
    });
  });
}

export { eventsArray };
