import Scripts from '../../../../scripts';

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: 'yoshi-server-javascript',
});

describe.each(['prod', 'dev'] as const)('yoshi-server testing [%s]', mode => {
  it('run tests', async () => {
    await scripts[mode]();
  });
});
