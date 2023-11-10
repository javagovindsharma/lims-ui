export interface User {
  email: any;
  firstname: any;
  lastname: any;
  isSuperUser: any;
  action: any;
}
export let initialUser: User = {
  email: "",
  firstname: "",
  lastname: "",
  isSuperUser: "No",
  action: "",
};
