import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { faqData } from '@/config/faq';
import React, { useState } from 'react';
import axios from 'axios'
import { config } from '@/config/config';
import toast from 'react-hot-toast';
import type { ApiResult } from '@/types';
import type { generateShortUrl } from '@/types/url';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Copy } from 'lucide-react';


const Landing = () => {

    const[longUrl, setLongUrl] = useState<string>("");
    const [shortUrls, setShortUrls] = useState<{ short: string; original: string }[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);


    const handleShorten = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        if (!longUrl.trim()) {
            toast.error("Please enter a valid URL!");
            return;
        }

        try{
            const res = await axios.post<ApiResult<generateShortUrl>>(`${config.BASE_URL}/api/urls`, {
                originalUrl: longUrl
            });

            const newShortUrl = res.data.data?.shortUrl
            if(newShortUrl)
            {
                setShortUrls((prev) => [{ short: newShortUrl, original: longUrl }, ...prev]);
                setLongUrl("");
                toast.success("Short URL generated successfully!")
            }
            else{
                toast.error("Something went wrong")
            }
        }
        catch(error)
        {
            console.log(error)
        }
    }

     const handleCopy = async (url: string, index: number) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedIndex(index);
            toast.success("Copied to clipboard!");
            setTimeout(() => setCopiedIndex(null), 1500);
        } catch (err) {
            toast.error("Failed to copy!");
        }
    };




  return (
    <div className="flex flex-col items-center">
        <h2 className='my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-black text-center font-extrabold'>Short Links. Big Insights.</h2>
        <form className='sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2' onSubmit={handleShorten}>
            <Input type='url' value={longUrl} placeholder='Enter your loooooong URL' onChange={(e) => setLongUrl(e.target.value)}
            className='h-full flex-1 py-4 px-4'/>
            <Button className='h-full' type="submit" variant="destructive">Shorten!</Button>
        </form>
        {shortUrls.length > 0 && (
            <div className="w-full md:w-2/4 mt-6 space-y-3">
            {shortUrls.map((urlObj, index) => (
                <Card
                key={index}
                className="flex items-center justify-between px-4 py-3 hover:shadow-md transition"
                >
                <CardContent className="p-0 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-sm">
                    <span className="text-gray-500 truncate max-w-[220px]">{urlObj.original}</span>
                    <a
                        href={urlObj.short}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        {urlObj.short}
                    </a>
                    </div>

                    <Button
                    variant="outline"
                    size="icon"
                    className="ml-0 sm:ml-3 mt-2 sm:mt-0"
                    onClick={() => handleCopy(urlObj.short, index)}
                    >
                    {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-green-600" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                    </Button>
                </CardContent>
                </Card>
            ))}
            </div>
        )}
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