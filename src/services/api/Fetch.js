
export default function(url, options) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => {
        return reject(new Error('timeout'));
      }, 10000)
    )
  ]);
}
