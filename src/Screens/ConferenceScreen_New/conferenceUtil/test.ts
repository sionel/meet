const test = (val: string) => {};
test.prototype.valtest = () => {
  console.log(test.prototype.val);
};

export default test;
