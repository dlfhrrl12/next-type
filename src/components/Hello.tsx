type HelloProps = {
    name: string;
}

const Hello = ({ name }: HelloProps) => {
    return (
        <>
            <h1 className="">Hello, {name}!</h1>
        </>
    );
};
export default Hello;