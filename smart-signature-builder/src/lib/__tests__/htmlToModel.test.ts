import { describe, expect, it } from 'vitest';
import { htmlToModel } from '../htmlToModel';

describe('htmlToModel', () => {
  it('parses a simple table signature with image and links', () => {
    const html = `
      <table>
        <tr>
          <td>
            <strong>Jamie Park</strong>
            <div><a href="mailto:jamie@example.com">jamie@example.com</a></div>
            <div><a href="tel:+15551234">+1 555 1234</a></div>
            <img src="data:image/png;base64,ZmFrZQ==" alt="Logo" />
          </td>
        </tr>
      </table>
    `;
    const result = htmlToModel(html);
    expect(result.state.identity.name).toBe('Jamie Park');
    expect(result.state.identity.email).toBe('jamie@example.com');
    expect(result.state.identity.phone).toBe('+1 555 1234');
    expect(result.state.nodes.some((node) => node.type === 'image')).toBe(true);
  });
});
