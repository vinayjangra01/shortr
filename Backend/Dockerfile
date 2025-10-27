# there's a build time and a run time.
FROM node:20         
# Start with node:18 image as base
WORKDIR /app          
COPY package*.json ./ 
RUN npm install      
# ← BUILD TIME: Install dependencies INTO the image
COPY . .              

EXPOSE 5000        
# on container launch   
CMD ["npm", "run", "dev"]
# ← RUN TIME: Start app when container launches