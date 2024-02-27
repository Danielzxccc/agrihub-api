CREATE TABLE admin_access(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    farms BOOLEAN DEFAULT FALSE,
    learning BOOLEAN DEFAULT FALSE,
    event BOOLEAN DEFAULT FALSE,
    blog BOOLEAN DEFAULT FALSE,
    forums BOOLEAN DEFAULT FALSE,
    admin BOOLEAN DEFAULT FALSE,
    cuai BOOLEAN DEFAULT FALSE,
    home BOOLEAN DEFAULT FALSE,
    about BOOLEAN DEFAULT FALSE,
    privacy_policy BOOLEAN DEFAULT FALSE,
    terms_and_conditions BOOLEAN DEFAULT FALSE,
    user_feedback BOOLEAN DEFAULT FALSE,
    crops BOOLEAN DEFAULT FALSE,
    help_center BOOLEAN DEFAULT FALSE,
    activity_logs BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
); 




-- FarmManagement
-- ResourceManagement
-- - LearningMaterials
-- - Events
-- - Blogs
-- ForumManagement
-- UsersManagement
-- AdminManagement
-- WebsiteManagement
-- - CenterForUrbanAgriculture(ito yung sa client details)
-- - HomePage
-- - AboutUs
-- - PrivacyPolicy
-- - TermsAndConditions
-- - UserFeedbacks
-- - HelpCenter
-- - Crops 
-- ActivityLogs