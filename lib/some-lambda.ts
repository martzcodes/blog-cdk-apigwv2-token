export const handler = async (event: any): Promise<any> => {
  console.log(JSON.stringify(event));

  return {
    statusCode: 200,
    headers: {},
    body: "yeah it worked",
  };
};
