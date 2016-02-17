import gettext
import os
# from django.utils.translation import ugettext

def ugettext(string):
    """
    Attempts to look up the string in the XBlock's own domain.  If it can't find that domain then
    we fall-back onto django.utils.translation.ugettext
    """
    print "********** xmodule.util.translation.ugettext: {0} **********".format(string)
    t = gettext.translation('django', "../venvs/edxapp/src/xblock-drag-and-drop-v2/conf/locale")
    _ = t.ugettext
    return _(string)
