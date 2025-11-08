import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { faqData } from '@/config/faq';
import React, { useState } from 'react';
import axios from 'axios'
import { config } from '@/config/config';
import toast from 'react-hot-toast';


const Landing = () => {

    const[longUrl, setLongUrl] = useState<string>("");

    const handleShoten = async (e: React.FormEvent<HTMLFormElement>) =>{
        try{
                e.preventDefault();
        
                const res = await axios.post(`${config.BASE_URL}/api/urls`, {
                    originalUrl: longUrl
                });
        
                toast("done")
        }
        catch(error)
        {
            console.log(error)
        }
    }

  return (
    <div className="flex flex-col items-center">
        <h2 className='my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-black text-center font-extrabold'>Short Links. Big Insights.</h2>
        <form className='sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2' onSubmit={handleShoten}>
            <Input type='url' value={longUrl} placeholder='Enter your loooooong URL' onChange={(e) => setLongUrl(e.target.value)}
            className='h-full flex-1 py-4 px-4'/>
            <Button className='h-full' type="submit" variant="destructive">Shorten!</Button>
        </form>
        <img src="/banner.png" alt="Shortr Banner" className='w-full my-11 md:px-11'/>
        <Accordion type="multiple" className="w-full md:px-11">
            {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  )
}

export default Landing; 