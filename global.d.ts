// global.d.ts ou styles.d.ts

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
