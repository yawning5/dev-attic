import { expect } from 'chai';
import busMock from './helpers/busMock.js';
import { UploadManager } from '../challenge/ch11~12/refactoring/um.js';

describe('UploadManager', () => {
  it('큐에 파일을 추가하고 이벤트를 emit한다', (done) => {
    const um = new UploadManager(busMock);      // 🔑 mock 주입
    const dummy = [{ type: '1', state: '대기중' }];

    busMock.once('printQueue', (q) => {
      try {
        expect(q).to.have.length(1);
        expect(q[0].type).to.equal('1');
        done();
      } catch (e) { done(e); }
    });

    um.addWQ(dummy);
  });
});
