const stampNow = () => new Date().toISOString().replace(/[:.]/g, "-");
export default stampNow;
