type RouterData = {
  message: any;
  metadata: any;
  destination: any;
};

export type RouterRequest = {
  input: RouterData[];
  destType: string;
};
