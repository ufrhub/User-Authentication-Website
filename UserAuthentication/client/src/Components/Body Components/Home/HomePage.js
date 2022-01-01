import React from 'react';

function HomePage() {

    return (
        <div className='HomePage'>
            <h1> User Authentication Website</h1>

            <h2>Hi... everyone...!</h2>

            <div>
                <p className='p'>I am Umar Farooque. I am pursuing Bachelor's degree in computer applications from Techno India University Kolkata West Bengal. I have completed my Full Stack Web Development Internship from Edureka!. </p>


                <p className='p'>My Internship Certificate from Edureka...!</p>
                <p className='p'>To verify Please copy this Certificate ID: " KNN9MZVF6 " and click <a href='https://www.edureka.co/verify' target="_blank" rel="noopener noreferrer">click here</a> </p>

                <a href='https://www.edureka.co/certificate/a329ebaeccdb1977161bb31053eea1cd.jpeg?ver=61d00158a3325' target="_blank" rel="noopener noreferrer">
                    <img src='https://www.edureka.co/certificate/a329ebaeccdb1977161bb31053eea1cd.jpeg?ver=61d00158a3325' alt='' />
                </a>
            </div>

            <p>This is a User Authentication Website. I created this website by using HTML, CSS, JavaScript, Mongodb (for database), Cloudinary (for image gallery), Node-JS and React-JS.</p>

            <p className='see-code'>Want to see code...?</p>

            <a href="https://github.com/ufrhub/User-Authentication-Website" target="_blank"
                rel="noopener noreferrer" className='link'>My GitHub Repository</a>

            <p className='see-code'>Contact Me...!</p>

            <a href="https://www.linkedin.com/in/umar-farooque-444b3a115/" target="_blank"
                rel="noopener noreferrer" className='link'>LinkedIn</a>
        </div >
    );

};

export default HomePage;
