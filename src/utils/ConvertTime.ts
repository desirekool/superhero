import moment from "moment";
const ConvertTime = (time: string) => moment(time).format("llll");

export default ConvertTime;