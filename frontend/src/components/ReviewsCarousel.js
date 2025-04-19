import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import '../styles/Reviews.scss';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const ReviewsCarousel = ({ reviews }) => {
  return (
    <div className="reviews-section">
      <h2 className="reviews-title">TAGASISIDE</h2>
      
      <div className="container">
        <div className="wrapper">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true} 
            initialSlide={1} 
            loop={true}
            loopedSlides={3} 
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2.2,
                centeredSlides: true,
              },
              1024: {
                slidesPerView: 3,
                centeredSlides: true,
              },
            }}
            className="review-swiper"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={index}>
                <div className="card">
                  <div className="card-content">
                    <p className="card-text">{review.text}</p>
                    <div className="card-footer">
                      <span className="reviewer-name">{review.author}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ReviewsCarousel;