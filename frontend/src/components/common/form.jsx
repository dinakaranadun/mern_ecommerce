// @ts-nocheck
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const CommonForm = ({registerFormControls,formData,setFormData,onSubmit,buttonText}) => {
    function renderComponentsByComponentType(item) {
        let element = null;
        const value = formData[item.name]
        switch(item.componentType){
            case 'input' :
                element = (
                    <Input className='h-10 border border-gray-950 '
                    name={item.name}
                    placeholder={item.placeholder}
                    id={item.name}
                    type={item.type}
                    value={value}
                    onChange={event=>setFormData({
                        ...formData,
                        [item.name]:event.target.value,
                    })}
                    />
                );
                break;
            case 'select' :
                element = (
                    <Select onValueChange={(value)=>({
                        ...formData,
                        [item.name]:value
                    })} value={value}>
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder={item.placeholder}/>
                        </SelectTrigger>
                        <SelectContent>
                        {item.option && item.option.length > 0 ? item.option.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                                {option.label}
                            </SelectItem>
                        )) : null}
                        </SelectContent>
                    </Select>
                );
                break;
            case 'textarea' :
                element = (
                    <Textarea
                        name={item.name}
                        placeholder={item.placeholder}
                        id={item.id}
                        value={value}
                        onChange={event=>setFormData({
                        ...formData,
                        [item.name]:event.target.value,
                    })}
                    />
                );
                break;

            default:
                element = (
                    <Input
                    name={item.name}
                    placeholder={item.placeholder}
                    id={item.name}
                    type={item.type}
                    value={value}
                    onChange={event=>setFormData({
                        ...formData,
                        [item.name]:event.target.value,
                    })}
                    />
                );
                break;
        }
        return element;
    }

  return (
    <form onSubmit={onSubmit}>
        <div className='flex flex-col gap-3'>
            {registerFormControls.map((item) => (
                <div className='grid w-full gap-2' key={item.name}>
                    <Label className='font-bold'>{item.label}</Label>
                    {renderComponentsByComponentType(item)}
                </div>
            ))}
        </div>
        <Button type='submit' className='mt-5 w-full'>{buttonText || 'Submit'}</Button>
    </form>
  );
}

export default CommonForm;