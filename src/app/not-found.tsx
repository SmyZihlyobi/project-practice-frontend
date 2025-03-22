import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 w-full mx-auto items-center">
      <Image src="/images/404/404.png" alt="Not Found" width={300} height={30} />
      <h1 className="text-9xl">404</h1>
      <h1 className="text-2xl font-semibold">Такой страницы нет</h1>
      <Link
        href={{
          pathname: '/',
        }}
        className="bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded
                pt-4 pb-4 pl-24 pr-24"
      >
        На главную
      </Link>
      <h2 className="mt-20">
        Если вы уверены, что произошла ошибка, свяжитесь с администратором
      </h2>
    </div>
  );
};

export default NotFound;
