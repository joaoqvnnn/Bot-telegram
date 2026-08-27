export const mercadopagoConfig = {
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY || '',
  payment: {
    backUrls: { success: '', failure: '', pending: '' },
    notificationUrl: '',
  },
};
export default mercadopagoConfig;
