import { useCrispyToast } from "../../src";
import { Toast } from "../../src/components";

export const DispatchButton = () => {
  const { toast } = useCrispyToast();
  const handleOnClick = () => {
    toast({
      render: (t) => (
        <Toast
          {...t}
          message="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita enim eaque aperiam! Provident maiores vero, et eaque adipisci neque exercitationem ut."
          variant="error"
        />
      ),
    });
  };

  return (
    <button
      onClick={handleOnClick}
      className="text-white font-bold tracking-tight border-2 rounded-lg  p-3 hover:bg-indigo-800 hover:border-indigo-900 transition-colors"
    >
      I am hungry
    </button>
  );
};
