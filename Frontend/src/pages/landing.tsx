import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { faqData } from '@/config/faq';
import React, { useState } from 'react';
import axios from 'axios';
import { config } from '@/config/config';
import toast from 'react-hot-toast';
import type { ApiResult } from '@/types';
import type { generateShortUrl } from '@/types/url';
import { Card } from '@/components/ui/card';
import { Check, Copy, ExternalLink, Share2, Loader2 } from 'lucide-react';
import axiosClient from '@/lib/axiosClient';


const Landing = () => {
    const [longUrl, setLongUrl] = useState<string>("");
    const [shortUrls, setShortUrls] = useState<{ short: string; original: string }[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleShorten = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!longUrl.trim()) {
            toast.error("Please enter a valid URL!");
            return;
        }

        try {
            setLoading(true);

            const res = await axiosClient.post<ApiResult<generateShortUrl>>(
                "/api/urls",
                { originalUrl: longUrl }
            );

            const newShortUrl = res.data.data?.shortUrl;

            if (newShortUrl) {
                setShortUrls(prev => [{ short: newShortUrl, original: longUrl }, ...prev]);
                setLongUrl("");
                toast.success("Short URL generated successfully!");
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            toast.error("Error creating short link");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (url: string, index: number) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedIndex(index);
            toast.success("Copied!");

            setTimeout(() => setCopiedIndex(null), 1500);
        } catch {
            toast.error("Failed to copy!");
        }
    };

    const handleShare = async (url: string) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Short URL",
                    text: "Check out this short link!",
                    url
                });
            } catch {
                toast.error("Sharing cancelled!");
            }
        } else {
            toast.error("Sharing not supported on this device");
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-black text-center font-extrabold">
                Short Links. Big Insights.
            </h2>

            {/* Input Section */}
            <form
                className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
                onSubmit={handleShorten}
            >
                <Input
                    type="url"
                    value={longUrl}
                    placeholder="Enter your long URL..."
                    onChange={(e) => setLongUrl(e.target.value)}
                    className="h-full flex-1 py-4 px-4"
                />

                <Button className="h-full" type="submit" disabled={loading}>
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        "Shorten!"
                    )}
                </Button>
            </form>

            {/* Generated Links */}
            {shortUrls.length > 0 && (
                <div className="w-full md:w-2/4 mt-6 space-y-4">
                    {shortUrls.map((urlObj, index) => (
                        <Card
                            key={index}
                            className="p-4 rounded-2xl shadow hover:shadow-md transition border flex flex-col gap-3"
                        >
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm truncate">{urlObj.original}</span>

                                <a
                                    href={urlObj.short}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 font-semibold hover:underline text-lg"
                                >
                                    {urlObj.short}
                                </a>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-2">
                                <Button
                                    variant="secondary"
                                    className="flex gap-2"
                                    onClick={() => window.open(urlObj.short, "_blank")}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Visit
                                </Button>

                                <Button
                                    variant="outline"
                                    className="flex gap-2"
                                    onClick={() => handleCopy(urlObj.short, index)}
                                >
                                    {copiedIndex === index ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                    Copy
                                </Button>

                                <Button
                                    variant="outline"
                                    className="flex gap-2"
                                    onClick={() => handleShare(urlObj.short)}
                                >
                                    <Share2 className="h-4 w-4" />
                                    Share
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <img src="/banner.png" alt="Shortr Banner" className="w-full my-11 md:px-11" />

            <Accordion type="multiple" className="w-full md:px-11">
                {faqData.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default Landing;
