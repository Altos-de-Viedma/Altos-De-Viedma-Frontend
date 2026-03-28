import { Icons } from '../../';



interface Props {
  id?: string;
  title: string;
}

export const CustomHeaderForm = ( { title, id }: Props ) => {

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 lg:gap-4 text-center sm:text-left w-full">

      <div className="flex-shrink-0">
        {
          id ? (
            <Icons.IoPencilOutline size={ 20 } className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary-600 dark:text-primary-400" />
          ) :
            (
              <Icons.IoAddOutline size={ 20 } className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary-600 dark:text-primary-400" />
            )
        }
      </div>

      <h2 className="responsive-text-base sm:responsive-text-lg lg:text-xl xl:text-2xl font-bold text-gradient">
        { title }
      </h2>

    </div>
  );
};
