

export  function removeNumberFromString(inputString: string | undefined) {
    console.log(inputString)
  if (typeof inputString === "string") {
    return inputString.replace(/-\d+$/, "");
  } else {
    throw new TypeError("The input provided is not a valid string.");
  }
}
