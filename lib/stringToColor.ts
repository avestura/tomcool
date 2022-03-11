export const colorizeString = (stringInput: string, theme: "dark" | "light") => {
    const stringUniqueHash = Array.from(stringInput).reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const lumen = theme === "dark" ? "80%" : "40%";
    return `hsl(${stringUniqueHash % 360}, 95%, ${lumen})`;
}