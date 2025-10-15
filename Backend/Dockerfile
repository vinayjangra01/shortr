# there's a build time and a run time.
FROM node:18         
# Start with node:18 image as base
WORKDIR /app          
COPY package*.json ./ 
RUN npm install      
# ← BUILD TIME: Install dependencies INTO the image
COPY . .              

EXPOSE 5000           
CMD ["npm", "start"]  
# ← RUN TIME: Start app when container launches