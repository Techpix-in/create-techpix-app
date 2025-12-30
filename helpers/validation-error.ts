import { red, cyan } from "picocolors";

export class ValidationError extends Error {
    constructor(
        message: string,
        public field?: string,
        public suggestion?: string
    ) {
        super(message);
        this.name = "ValidationError";
    }

    /**
     * Format the error for CLI display.
     */
    format(): string {
        let result = `${red("Validation Error:")} ${this.message}`;
        if (this.field) {
            result += ` (Field: ${cyan(this.field)})`;
        }
        if (this.suggestion) {
            result += `\n${cyan("Suggestion:")} ${this.suggestion}`;
        }
        return result;
    }
}
