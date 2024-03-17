import Image from "next/image";
import loading from "public/480.gif";

export const LoadingDog = () => {
  return (
    <div className="absolute flex h-fit w-fit items-center justify-center align-middle">
      <Image src={loading} alt="loading" width={50} height={50} />
    </div>
  );
};

export const LoadingDogPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center align-middle">
      <LoadingDog />
    </div>
  );
};
