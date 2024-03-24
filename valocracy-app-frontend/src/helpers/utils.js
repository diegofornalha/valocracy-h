import { ProposalStatusEnum } from "../enum/ProposalStatusEnum";

const getStatusColor = (status) => {
  switch (status) {
    case ProposalStatusEnum.OPEN:
      return "green";
    case ProposalStatusEnum.APPROVED:
      return "green";
    case ProposalStatusEnum.INVALIDATED:
      return "red";
    case ProposalStatusEnum.REPROVED:
      return "red";
    case ProposalStatusEnum.VETOED:
      return "red";
    case ProposalStatusEnum.CLOSED:
      return "red";
    default:
      return "gray";
  }
};

export const convertToBrazilianDateFormat = (datetime) => {
  console.log("convertToBrazilianDateFormat", datetime);
  // Parse the datetime string into a Date object
  const dateObj = new Date(datetime);

  // Extract the day, month, and year from the Date object
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year = dateObj.getFullYear();

  // Format the date in DD/MM/YYYY format
  const brazilianDateFormat = `${day}/${month}/${year}`;

  return brazilianDateFormat;
};

const utils = {
  getStatusColor,
  convertToBrazilianDateFormat
};

export default utils;
