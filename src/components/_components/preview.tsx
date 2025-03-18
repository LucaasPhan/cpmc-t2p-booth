import Image from "next/image"

const Preview = ({image, width, height}: {image: string, width: number, height: number}) => {
    return (
        <Image src={image} width={width} height={height} alt='Uploaded image' style={{maxWidth: '100%', marginTop: '10px'}}/>
    );
};

export default Preview;