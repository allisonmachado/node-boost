export const process = () => "Hello World";

if (require.main === module) {
    console.log(process()); // tslint:disable-line
}
