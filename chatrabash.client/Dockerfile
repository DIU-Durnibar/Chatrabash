# Alpine বাদ দিয়ে আমরা Debian (Standard) ব্যবহার করছি
# এতে কোনো কম্পাটিবিলিটি ইস্যু থাকে না
FROM node:20 AS build
WORKDIR /app

# আগে শুধু package.json কপি করব (স্মার্ট ক্যাশিং)
COPY package*.json ./

# এখানে আমরা lock ফাইল ডিলিট করে ফ্রেশ ইন্সটল করব
# যাতে উইন্ডোজের কোনো সেটিংস লিনাক্সে না আসে
RUN rm -rf package-lock.json
RUN npm install

# এবার বাকি সব ফাইল কপি করব
COPY . .

# ফাইনাল বিল্ড
RUN npm run build

# সার্ভ করার জন্য Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]