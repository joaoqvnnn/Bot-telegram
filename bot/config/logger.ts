export const logger = {
  info: (mensagem: string, ...args: any[]) => {
    console.log(`[INFO] ${mensagem}`, ...args);
  },
  error: (mensagem: string, ...args: any[]) => {
    console.error(`[ERROR] ${mensagem}`, ...args);
  },
  warn: (mensagem: string, ...args: any[]) => {
    console.warn(`[WARN] ${mensagem}`, ...args);
  },
};
export default logger;
