//Разработка:
export default Object({
  API: 'http://t.myqf.ru/backend/api/main.php',
  UPLOAD_IMG_URL: "http://t.myqf.ru/backend/upload.php", //Скрипт загрузки изображений
  AUTH_URL: 'http://t.myqf.ru/backend/auth.php', //Скрипт авторизации через соцсети
  VK_AUTH_URL: 'https://oauth.vk.com/authorize?client_id=7870026&display=page&redirect_uri=http://localhost:8080/auth/vk&scope=offline&response_type=token&v=5.52',
  WidePages: ['/test/', '/gtest/', '/result/'], // Широкие страницы без меню навигации
});

// Для хостинга:
// export default Object({
//   API: 'https://t.myqf.ru/backend/api/main.php',
//   UPLOAD_IMG_URL: "https://t.myqf.ru/backend/upload.php", //Скрипт загрузки изображений
//   AUTH_URL: 'https://t.myqf.ru/backend/auth.php', //Скрипт авторизации через соцсети
//   VK_AUTH_URL: 'https://oauth.vk.com/authorize?client_id=7870026&display=page&redirect_uri=https://t.myqf.ru/auth/vk&scope=offline&response_type=token&v=5.52',
//   WidePages: ['/test/', '/gtest/', '/result/'], // Широкие страницы без меню навигации
// });