export const handleImg = (imgSrc?: string) => {
  let insteadImg = imgSrc;
  
  if(typeof imgSrc === 'string' && imgSrc.indexOf('http') === -1){
    //imgSrc 是字符串，但不包含 http
    insteadImg = 'http://backend-api-01.newbee.ltd' + imgSrc;
  }
  
  return insteadImg;
}