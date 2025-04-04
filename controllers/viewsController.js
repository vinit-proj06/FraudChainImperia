exports.getOverview = (req, res) => {
  res.status(200).render('base', {
    title: 'Welcome'
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login Form'
  });
};
