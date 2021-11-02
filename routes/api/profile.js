const express = require('express');
const request = require('request');
const config = require('config');

const axios = require('axios');

const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator')

const Profile = require('../../models/Profile');
const User = require('../../models/User');

const Post = require('../../models/Post');



    router.get('/me', auth, async (req, res) => {
        
        try {

            const profile = await Profile.findOne({ user: req.user.id}).populate('user',['name','avatar']);

                if (!profile) {
                        return res.status(400).json({msg: 'There is no profile for this user'});

                }

            res.json(profile);

        } catch(err) {

            console.error(err.message);
            res.status(500).send('Server error')
        }

     });

    
    
     router.post('/', [ auth, [ check('status','Status is required').not().isEmpty() , check('skills','Skills is required').not().isEmpty() ]] , async (req, res) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin} = req.body;

            const profileFields = {};
            profileFields.user = req.user.id;
            if (company) profileFields.company = company
            if (website) profileFields.website = website
            if (location) profileFields.location = location
            if (bio) profileFields.bio = bio
            if (status) profileFields.status = status
            if (githubusername) profileFields.githubusername = githubusername

            if (skills) {
                profileFields.skills = skills.split(',').map(skill => skill.trim())
            }

            profileFields.social = {};

            if (youtube) profileFields.social.youtube = youtube;
            if (twitter) profileFields.social.twitter = twitter;
            if (facebook) profileFields.social.facebook = facebook;
            if (linkedin) profileFields.social.linkedin = linkedin;
            if (instagram) profileFields.social.instagram = instagram;
  

            // console.log(profileFields.skills);

            // res.send('Hello');


            try {

                let profile = await Profile.findOne({ user: profileFields.user })


                // update if exists

                if (profile) {
                        
                    profile = await Profile.findOneAndUpdate({ user: profileFields.user}, {$set: profileFields}, {new: true});

                    return res.json(profile);

                }

                // create if it doesnt exist yet

                profile = new Profile(profileFields);

                await profile.save();
                res.json(profile);
            


            } catch(err) {
                console.error(err.message);
                res.status(500).send('Server error');

            }

       });




    router.get('/', async (req, res) => {
        
        try {

      const profiles = await Profile.find().populate('user',['name','avatar'])
       res.json(profiles);     

    
            

        } catch(err) {

       console.error(err.message);
       res.status(500).send('Server error')
            
        }

    });

        router.get('/user/:user_id', async (req, res) => {
        
            try {
    
          const profile = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar'])
             
    
        if (!profile) {
            return res.status(400).json({msg: 'Profile not found'});
        };

        res.json(profile);   
                
    
            } catch(err) {
    
           console.error(err.message);

           if (err.kind == 'ObjectId') {
                return res.status(400).json({msg: 'Profile not found'});
           }
           res.status(500).send('Server error')
                
            }

     
     });


     router.delete('/', auth, async (req, res) => {
        
        try {


            // remove user's posts

    await Post.deleteMany({ user: req.user.id })

            // remove profile
    await Profile.findOneAndRemove({user: req.user.id});

            // remove user
    await User.findOneAndRemove({_id: req.user.id});

       res.json({msg: 'User deleted.'});     

    
            

        } catch(err) {

       console.error(err.message);
       res.status(500).send('Server error')
            
        }

    });


    router.put('/experience', [auth, [check('title', 'Title is required').not().isEmpty(),check('company', 'Company is required').not().isEmpty(),check('from', 'From date is required').not().isEmpty()]], async(req,res) => {

    
            
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()})

                }

            const { title, company, location, from, to, current, description } = req.body;

            const newExp = {title, company, location, from, to, current, description}

         try {

                const profile = await Profile.findOne({user: req.user.id});
                profile.experience.unshift(newExp);
                await profile.save();

                res.json(profile);
                
        } catch (err) {
            
                console.error(err.message);
                res.status(500).send('Server error');

        }





    })


    router.delete('/experience/:exp_id', auth, async(req,res) => {


    
    
      

  

 try {

        const profile = await Profile.findOne({user: req.user.id});

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)


        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
        
} catch (err) {
    
        console.error(err.message);
        res.status(500).send('Server error');

}





});





router.put('/education', [auth, [check('school', 'School is required').not().isEmpty(),check('fieldofstudy', 'Field of study is required').not().isEmpty(),check('from', 'From date is required').not().isEmpty(),check('degree', 'Degree of study is required').not().isEmpty()]], async(req,res) => {

    
            
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})

    }

const { school, degree, fieldofstudy, from, to, current, description } = req.body;

const newEdu = {school, degree, fieldofstudy, from, to, current, description}

try {

    const profile = await Profile.findOne({user: req.user.id});
    profile.education.unshift(newEdu);
    await profile.save();

    res.json(profile);
    
} catch (err) {

    console.error(err.message);
    res.status(500).send('Server error');

}





})


router.delete('/education/:edu_id', auth, async(req,res) => {








try {

const profile = await Profile.findOne({user: req.user.id});

const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)


profile.education.splice(removeIndex, 1);

await profile.save();

res.json(profile);

} catch (err) {

console.error(err.message);
res.status(500).send('Server error');

}





});




router.get('/github/:username', async (req, res) => {
    try {

      const uri = encodeURI(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      );
      const headers = {
        'user-agent': 'node.js',
        Authorization: `token ${config.get('githubToken')}`
      };
  
      const gitHubResponse = await axios.get(uri, { headers });
 
      return res.json(gitHubResponse.data);
    } catch (err) {
      console.error(err.message);
    //   return res.status(404).json({ msg: 'No Github profile found' });
      
    }
  });


module.exports = router;