import { Icons } from '../../';



interface Props {
  id?: string;
  title: string;
}

export const CustomHeaderForm = ( { title, id }: Props ) => {

  return (
    <div className="flex justify-center items-center space-x-2">

      {
        id ? (
          <Icons.IoAddOutline size={ 24 } />
        ) :
          (
            <Icons.IoPencilOutline size={ 24 } />
          )
      }

      <h2 className="text-xl">{ title }</h2>

    </div>
  );
};
