FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies
RUN npm install --production
# Copy application code
COPY . .
# Expose port (if needed)
EXPOSE 9000
# Run the application
CMD ["node", "index.js"]
