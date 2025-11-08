import {nanoid} from 'nanoid';
import UrlModel from "../models/urlModel.js";
import { urlSchema } from '../utils/validation.js';
import config from '../config/env.js'

class UrlController {

    static async createShortUrl(req, res, next){
        try{
            const validateData = await urlSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });

            const {originalUrl, customUrl, title} = validateData;
            const userId = req.user?.userId || null;//optional user id

            if(customUrl)
            {
                const exits = await UrlModel.customUrlExists(customUrl);
                if(exits)
                {
                    return res.status(409).json({
                        success: false,
                        message: 'Custom URL already taken',
                    });
                }
            }

            const shortId = customUrl || nanoid(6);
            const shortUrl = `${config.baseUrl}/${shortId}`;

            const url = await UrlModel.create({
                originalUrl,
                shortUrl: shortId,
                customUrl,
                userId,
                title,
                qrCode: null
            });

            res.status(201).json({
                success: true,
                message: "Short URL created successfully",
                data:{
                    id: url.id,
                    originalUrl: url.original_url,
                    shortUrl,
                    customUrl: url.custom_url,
                    title: url.title,
                    createdAt: url.created_at
                },
            });
        }
        catch(error)
        {
            console.log(error.message, "error");
            next(error);
        }
    }

      static async getUserUrls(req, res, next) {
        try {
            const userId = req.user.userId;
            const urls = await UrlModel.findByUserId(userId);

            //include full shorturl
            const transformedUrls = urls.map((url) => ({
                id: url.id,
                originalUrl: url.original_url,
                shortUrl: `${config.baseUrl}/${url.custom_url || url.short_url}`,
                customUrl: url.custom_url,
                title: url.title,
                visitCount: parseInt(url.visit_count),
                createdAt: url.created_at,
            }));

            res.json({
                success: true,
                data: { urls: transformedUrls },
            });
        } catch (error) {
            next(error);
        }
    }


    static async getUrlAnalytics(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;

            const urls = await UrlModel.findByUserId(userId);
            const url = urls.find((u) => u.id === parseInt(id));

            if (!url) {
                return res.status(404).json({
                success: false,
                message: 'URL not found or unauthorized',
                });
            }

            const analytics = await UrlModel.getAnalytics(parseInt(id));

            res.json({
                success: true,
                data: {
                urlId: parseInt(id),
                totalVisits: parseInt(analytics.total_visits),
                uniqueCountries: parseInt(analytics.unique_countries),
                uniqueDevices: parseInt(analytics.unique_devices),
                countries: analytics.countries || [],
                devices: analytics.devices || [],
                cities: analytics.cities || [],
                },
            });
        } catch (error) {
            next(error);
        }
   }
   
   static async redirectUrl(req, res, next) {
    try {
      const { shortUrl } = req.params;

      const url = await UrlModel.findByShortUrl(shortUrl);

      if (!url) {
        return res.status(404).json({
          success: false,
          message: 'Short URL not found',
        });
      }

      await UrlModel.recordVisit({
        urlId: url.id,
        city: null,
        device: req.headers['user-agent'] || 'unknown',
        country: null,
      });

      // Redirect to original 
      res.redirect(301, url.original_url);
    } catch (error) {
      next(error);
    }
  }

}

export default UrlController;