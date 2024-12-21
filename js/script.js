document.addEventListener("DOMContentLoaded", () => {
  const wheel = document.querySelector(".hoop");
  const prizes = document.querySelector(".prizz");
  const buttonCenter = document.querySelector(".btn__center");
  const buttonTwist = document.querySelector(".button__twist");
  const counter = document.querySelector("#number");
  const modal = document.getElementById("modal");
  const modal2 = document.getElementById("modal2");
  const dopBtn = document.getElementById("ehce");
  const dopBtn2 = document.getElementById("ehce2");
  const buttonTwist2 = document.querySelector(".button__twist3");
  const buttonClaim = document.querySelector(".button__twist2"); // Новая кнопка "ЗАБРАТЬ"
  const wrapper = document.querySelector(".wrapper");
  const footer = document.querySelector("footer");
  let rotation = 0;
  let spinsRemaining;
  let spinning = false;
  let spinCount = 0; // Счётчик количества прокрутов

  // Массив углов для каждого из 10 прокрутов (в градусах)
  const rotationAngles = [85, 170, 385, 525, 730, 900, 1055, 1290, 1413, 1630];

  // Инициализация счетчика из localStorage
  function initializeCounter() {
    const storedSpins = localStorage.getItem("spinsRemaining");
    spinsRemaining = storedSpins ? parseInt(storedSpins, 10) : 10; // По умолчанию 10 прокрутов
    counter.textContent = spinsRemaining;
    updateCounterStyle();
    updateButtonVisibility();
  }

  // Обновление стиля счетчика в зависимости от значения
  function updateCounterStyle() {
    if (spinsRemaining < 10) {
      counter.classList.add("small-number");
    } else {
      counter.classList.remove("small-number");
    }
  }

  // Обновление видимости кнопок
  function updateButtonVisibility() {
    if (spinsRemaining <= 0) {
      buttonCenter.disabled = true;
      buttonTwist.classList.remove("hidden"); // Показываем кнопку "ПОЛУЧИТЬ ЕЩЕ"
      dopBtn2.classList.add("hidden"); // Скрываем кнопку "КРУТИТЬ"
    } else {
      buttonCenter.disabled = false;
      buttonTwist.classList.add("hidden"); // Скрываем кнопку "ПОЛУЧИТЬ ЕЩЕ"
      dopBtn2.classList.remove("hidden"); // Показываем кнопку "КРУТИТЬ"
    }
  }

  // Обновление счетчика и сохранение в localStorage
  function updateCounter() {
    spinsRemaining -= 1;
    counter.textContent = spinsRemaining;
    localStorage.setItem("spinsRemaining", spinsRemaining);
    updateCounterStyle();
    updateButtonVisibility(); // Обновляем видимость кнопок
  }

  // Функция для нахождения угла поворота для следующего прокрута
  function getRotationAngleForSpin(spinNumber) {
    // Находим индекс угла в массиве углов в зависимости от номера прокрута
    const index = (spinNumber - 1) % rotationAngles.length;
    return rotationAngles[index];
  }

  // Инициализация при загрузке страницы
  initializeCounter();

  function handleSpin() {
    if (spinning || spinsRemaining <= 0) return; // Если колесо уже крутится или прокруты закончились, игнорируем нажатие

    spinning = true;
    spinCount += 1; // Увеличиваем счётчик прокрутов

    // Получаем угол для текущего прокрута
    const targetRotationAngle = getRotationAngleForSpin(spinCount);

    // Определяем общее количество поворота
    const totalRotation = rotation + 360 * 3 + targetRotationAngle;

    wheel.style.transition = "transform 4s ease-out";
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    prizes.style.transition = "transform 4s ease-out";
    prizes.style.transform = `rotate(${totalRotation}deg)`;

    rotation = totalRotation; // Обновляем текущее значение

    // После завершения анимации
    setTimeout(() => {
      spinning = false;
      updateCounter(); // Обновляем счетчик прокрутов

      // Задержка перед открытием модального окна
      setTimeout(() => {
        // Скрываем элементы на главном экране
        wrapper.classList.add("hidden");
        footer.classList.add("hidden");

        // Открываем модальное окно
        modal.style.display = "flex";
        document.getElementById("prize-name").textContent =
          getPrizeName(targetRotationAngle); // Установите имя приза
      }, 1000); // Задержка 1 секунда
    }, 4000); // Время должно совпадать с продолжительностью анимации
  }

  function getPrizeName(angle) {
    const prizes = ["Ваучер", "Ваучер"];

    // Найдите приз по углу (это пример, можно изменить логику по вашему усмотрению)
    const index = rotationAngles.indexOf(angle);
    return prizes[index] || "Ваучер";
  }

  // Закрытие модальных окон при клике вне их
  function handleModalClose(event, modalElement) {
    if (event.target === modalElement) {
      modalElement.style.display = "none";
      wrapper.classList.remove("hidden");
      footer.classList.remove("hidden");
    }
  }

  window.addEventListener("click", (event) => {
    handleModalClose(event, modal);
    handleModalClose(event, modal2);
  });

  // Закрытие модальных окон при нажатии клавиши Esc
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (modal.style.display === "flex") {
        modal.style.display = "none";
      }
      if (modal2.style.display === "block") {
        modal2.style.display = "none";
      }
      wrapper.classList.remove("hidden");
      footer.classList.remove("hidden");
    }
  });

  buttonCenter.addEventListener("click", handleSpin);

  dopBtn.addEventListener("click", () => {
    modal2.style.display = "block";
  });

  dopBtn2.addEventListener("click", handleSpin); // Обработчик для кнопки "КРУТИТЬ"

  buttonTwist2.addEventListener("click", () => {
    modal2.style.display = "none"; // Закрытие второго модального окна при нажатии на кнопку "ЗАБРАТЬ"
  });

  // Новый обработчик для кнопки "ЗАБРАТЬ"
  buttonClaim.addEventListener("click", () => {
    modal.style.display = "none"; // Закрытие первого модального окна при нажатии на кнопку "ЗАБРАТЬ"
    wrapper.classList.remove("hidden");
    footer.classList.remove("hidden");
  });
});
