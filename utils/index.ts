const capitalizeFirstLetter = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);


const parseTraitName = (partName: string): string =>
    capitalizeFirstLetter(partName.substring(partName.indexOf('-') + 1).replace(/-/g, ' '));

export default parseTraitName;
